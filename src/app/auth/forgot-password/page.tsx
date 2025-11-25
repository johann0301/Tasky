"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AuthCard } from "@/features/auth/components/auth-card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/shared/components/form";
import { Input } from "@/shared/components/input";
import { Button } from "@/shared/components/button";
import { requestPasswordReset } from "@/actions/auth";
import { Mail } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);
    try {
      const result = await requestPasswordReset(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success) {
        setIsSubmitted(true);
        toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
      }
    } catch (error) {
      toast.error("Erro ao solicitar recuperação de senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <AuthCard
        title="Email Enviado"
        description="Verifique sua caixa de entrada"
        backButtonHref="/auth/login"
        backButtonLabel="Voltar para login"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Enviamos um link de recuperação para <strong>{form.getValues("email")}</strong>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Clique no link recebido para redefinir sua senha. O link expira em 1 hora.
            </p>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Recuperar Senha"
      description="Digite seu email para receber um link de recuperação"
      backButtonHref="/auth/login"
      backButtonLabel="Voltar para login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Enviaremos um link para redefinir sua senha
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}

