import type { Metadata } from "next";
import { Button } from "@/shared/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/card";
import { Mail, MessageCircle, BookOpen, HelpCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ajuda e Suporte - Tasky",
  description:
    "Precisa de ajuda com o Tasky? Entre em contato conosco ou consulte nossa documentação e FAQ.",
  keywords: ["ajuda", "suporte", "contato", "tasky", "tarefas"],
  openGraph: {
    title: "Ajuda e Suporte - Tasky",
    description: "Precisa de ajuda com o Tasky? Entre em contato conosco.",
    type: "website",
  },
};

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <HelpCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="mb-4 text-4xl font-bold">Central de Ajuda</h1>
          <p className="text-lg text-muted-foreground">
            Estamos aqui para ajudar você a aproveitar ao máximo o Tasky
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>
                Consulte respostas para as dúvidas mais comuns sobre o Tasky
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/faq">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Ver FAQ
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Entre em Contato</CardTitle>
              <CardDescription>
                Envie-nos um email se precisar de suporte adicional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full" size="lg">
                <a href="mailto:suporte@tasky.com?subject=Suporte Tasky">
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar Email
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recursos Úteis</CardTitle>
              <CardDescription>
                Explore nossos recursos para começar a usar o Tasky
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <MessageCircle className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Como Começar</h3>
                  <p className="text-sm text-muted-foreground">
                    Crie sua conta gratuitamente e comece a organizar suas tarefas
                    imediatamente. É fácil e rápido!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <BookOpen className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Dicas de Uso</h3>
                  <p className="text-sm text-muted-foreground">
                    Use prioridades para destacar tarefas importantes e defina
                    datas de vencimento para nunca perder um prazo.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <HelpCircle className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Precisa de Mais Ajuda?</h3>
                  <p className="text-sm text-muted-foreground">
                    Consulte nossa seção de FAQ ou entre em contato conosco. Estamos
                    sempre prontos para ajudar!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

