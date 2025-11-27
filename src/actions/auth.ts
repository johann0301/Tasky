"use server";

import { db } from "@/lib/db";
import { users, verificationTokens } from "../../database/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { Resend } from "resend";
import { getZodErrorMessage } from "@/shared/util/error-handler";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import "server-only";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const resetPasswordRequestSchema = z.object({
  email: z.string().email("Email inválido"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const updateProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  image: z.string().url("URL inválida").optional(),
});

export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    const validatedData = registerSchema.parse(data);

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser) {
      return { error: "Email já cadastrado" };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      })
      .returning();

    return { success: true, user: { id: newUser.id, email: newUser.email } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: getZodErrorMessage(error) };
    }
    return { error: "Erro ao registrar usuário" };
  }
}

export async function requestPasswordReset(
  data: z.infer<typeof resetPasswordRequestSchema>
) {
  try {
    const { email } = resetPasswordRequestSchema.parse(data);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);


    if (!user) {
      return { success: true };
    }

    const resetToken = createId();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); 

    await db.insert(verificationTokens).values({
      identifier: email,
      token: resetToken,
      expires: expiresAt,
    });


    const baseUrl = process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;

    if (resend) {
      try {

        const fromEmail = 
          process.env.NODE_ENV === "development"
            ? "onboarding@resend.dev"
            : process.env.RESEND_FROM_EMAIL || "noreply@tasky.app";

        console.log("[Resend] Tentando enviar email...");
        console.log("[Resend] From:", fromEmail);
        console.log("[Resend] To:", email);
        console.log("[Resend] API Key presente:", !!process.env.RESEND_API_KEY);

        const result = await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: "Recuperação de Senha - Tasky",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Recuperação de Senha</h1>
              <p>Olá,</p>
              <p>Recebemos uma solicitação para redefinir a senha da sua conta no Tasky.</p>
              <p>Clique no botão abaixo para criar uma nova senha:</p>
              <div style="margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Redefinir Senha</a>
              </div>
              <p>Ou copie e cole este link no seu navegador:</p>
              <p style="color: #666; word-break: break-all;">${resetUrl}</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">Este link expira em 1 hora.</p>
              <p style="color: #999; font-size: 12px;">Se você não solicitou esta recuperação de senha, ignore este email.</p>
            </div>
          `,
        });

        console.log("[Resend] Email enviado com sucesso:", result);
      } catch (error) {
        console.error("[Resend] Erro ao enviar email:");
        console.error("[Resend] Tipo do erro:", error instanceof Error ? error.constructor.name : typeof error);
        console.error("[Resend] Mensagem:", error instanceof Error ? error.message : String(error));
        
        if (error && typeof error === "object" && "message" in error) {
          console.error("[Resend] Detalhes completos:", JSON.stringify(error, null, 2));
        }
        
        if (error instanceof Error && error.message.includes("domain")) {
          console.error("[Resend] ERRO: Domínio não verificado. Em DEV, use onboarding@resend.dev");
        }
        
      }
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log("=".repeat(50));
        console.log("EMAIL DE RECUPERAÇÃO DE SENHA (SIMULADO):");
        console.log("Para:", email);
        console.log("Link:", resetUrl);
        console.log("=".repeat(50));
      }
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: getZodErrorMessage(error) };
    }
    return { error: "Erro ao solicitar recuperação de senha" };
  }
}

export async function resetPassword(
  data: z.infer<typeof resetPasswordSchema>
) {
  try {
    const { token, password } = resetPasswordSchema.parse(data);

    const [tokenRecord] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          gt(verificationTokens.expires, new Date())
        )
      )
      .limit(1);

    if (!tokenRecord) {
      return { error: "Token inválido ou expirado" };
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, tokenRecord.identifier))
      .limit(1);

    if (!user) {
      return { error: "Usuário não encontrado" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: getZodErrorMessage(error) };
    }
    return { error: "Erro ao resetar senha" };
  }
}

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  try {
    const validatedData = loginSchema.parse(credentials);
    const { signIn } = await import("@/lib/auth");
    
    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (!result || result.error) {
      return { error: result?.error || "Credenciais inválidas" };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: getZodErrorMessage(error) };
    }
    return { error: "Erro ao fazer login" };
  }
}

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "Usuário não autenticado" };
    }

    const validatedData = updateProfileSchema.parse(data);

    await db
      .update(users)
      .set({
        name: validatedData.name,
        image: validatedData.image || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: getZodErrorMessage(error) };
    }
    return { error: "Erro ao atualizar perfil" };
  }
}
