"use server";

import { db } from "@/lib/db";
import { users, verificationTokens } from "../../database/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { Resend } from "resend";
import { getZodErrorMessage } from "@/shared/util/error-handler";
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

// Registrar novo usuário
export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    const validatedData = registerSchema.parse(data);

    // Verificar se email já existe
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser) {
      return { error: "Email já cadastrado" };
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Criar usuário
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

// Solicitar reset de senha
export async function requestPasswordReset(
  data: z.infer<typeof resetPasswordRequestSchema>
) {
  try {
    const { email } = resetPasswordRequestSchema.parse(data);

    // Buscar usuário
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Não revelar se o email existe ou não por segurança
    if (!user) {
      return { success: true };
    }

    // Gerar token
    const resetToken = createId();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expira em 1 hora

    // Salvar token no banco (usando verificationTokens do NextAuth)
    await db.insert(verificationTokens).values({
      identifier: email,
      token: resetToken,
      expires: expiresAt,
    });

    // Enviar email (simulado ou via Resend)
    const resetUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    if (resend) {
      // Enviar email via Resend
      await resend.emails.send({
        from: "noreply@example.com",
        to: email,
        subject: "Recuperação de Senha",
        html: `
          <h1>Recuperação de Senha</h1>
          <p>Clique no link abaixo para redefinir sua senha:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Este link expira em 1 hora.</p>
        `,
      });
    } else {
      // Simular envio (apenas em desenvolvimento)
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

// Resetar senha com token
export async function resetPassword(
  data: z.infer<typeof resetPasswordSchema>
) {
  try {
    const { token, password } = resetPasswordSchema.parse(data);

    // Buscar token válido
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

    // Buscar usuário pelo email (identifier)
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, tokenRecord.identifier))
      .limit(1);

    if (!user) {
      return { error: "Usuário não encontrado" };
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Atualizar senha
    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // Deletar token usado
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
