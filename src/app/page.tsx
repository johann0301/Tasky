import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/shared/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/card";
import {
  CheckCircle2,
  LayoutGrid,
  Clock,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  ListTodo,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tasky - Gerencie suas Tarefas com Facilidade",
  description:
    "Tasky é uma aplicação moderna de gerenciamento de tarefas construída com Next.js 15, tRPC, e Drizzle ORM. Organize suas tarefas de forma eficiente com visualização em lista e kanban.",
  keywords: [
    "gerenciamento de tarefas",
    "task manager",
    "kanban",
    "produtividade",
    "organização",
    "tarefas",
    "Next.js",
    "T3 Stack",
  ],
  authors: [{ name: "Tasky Team" }],
  openGraph: {
    title: "Tasky - Gerencie suas Tarefas com Facilidade",
    description:
      "Aplicação moderna de gerenciamento de tarefas com visualização em lista e kanban.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasky - Gerencie suas Tarefas com Facilidade",
    description:
      "Aplicação moderna de gerenciamento de tarefas com visualização em lista e kanban.",
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Gerencie suas Tarefas
            <span className="text-primary"> de Forma Inteligente</span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Tasky é a solução completa para organizar seu trabalho e aumentar sua
            produtividade. Visualize suas tarefas em lista ou kanban, defina
            prioridades e acompanhe seu progresso.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/auth/register">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link href="/stats">Ver Estatísticas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Recursos Principais</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Tudo que você precisa para gerenciar suas tarefas com eficiência
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <LayoutGrid className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Visualização Kanban</CardTitle>
                <CardDescription>
                  Organize suas tarefas em colunas visuais (A Fazer, Em Progresso,
                  Concluídas) e mova-as facilmente entre os status.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Visualização em Lista</CardTitle>
                <CardDescription>
                  Visualize todas suas tarefas em formato de lista com filtros
                  avançados por status, prioridade e busca.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Prazos e Prioridades</CardTitle>
                <CardDescription>
                  Defina datas de vencimento e prioridades (Baixa, Média, Alta)
                  para manter o foco no que realmente importa.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Interface Rápida</CardTitle>
                <CardDescription>
                  Construída com Next.js 15 e tRPC para máxima performance e
                  experiência de usuário fluida.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Seguro e Confiável</CardTitle>
                <CardDescription>
                  Autenticação segura com NextAuth v5 e dados protegidos. Suas
                  tarefas estão sempre seguras.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Estatísticas Públicas</CardTitle>
                <CardDescription>
                  Acompanhe estatísticas gerais da plataforma e veja quantas
                  tarefas já foram criadas.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-lg border bg-primary/5 p-12 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="mb-4 text-3xl font-bold">Pronto para Começar?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Crie sua conta gratuitamente e comece a organizar suas tarefas hoje
            mesmo.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/auth/register">
                Criar Conta Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link href="/auth/login">Fazer Login</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
