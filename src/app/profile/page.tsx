import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks } from "@/database/schema";
import { eq, sql, and, ne } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar";
import { CheckCircle2, Circle, BarChart3, Edit2 } from "lucide-react";
import { ProfileFormDialog } from "@/features/auth/components/ProfileFormDialog";
import "server-only";

async function getUserStats(userId: string) {
  // Total de tarefas
  const [totalResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(tasks)
    .where(eq(tasks.userId, userId));

  // Tarefas concluídas
  const [doneResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.status, "done")));

  // Tarefas em aberto (não concluídas)
  const [openResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(tasks)
    .where(and(eq(tasks.userId, userId), ne(tasks.status, "done")));

  return {
    total: totalResult?.count ?? 0,
    done: doneResult?.count ?? 0,
    open: openResult?.count ?? 0,
  };
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const stats = await getUserStats(session.user.id);

  const userInitials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session.user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <ProfileFormDialog
            initialName={session.user.name}
            initialImage={session.user.image}
          />
        </div>

        {/* Card do Usuário */}
        <Card className="mb-8 bg-card border shadow-sm">
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
            <CardDescription>Suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <Avatar className="h-24 w-24">
                <AvatarImage src={session.user.image ?? undefined} />
                <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-semibold">{session.user.name ?? "Usuário"}</h2>
                <p className="mt-2 text-muted-foreground">{session.user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo de Tarefas */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Resumo</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Total de Tarefas */}
            <Card className="bg-card border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total.toLocaleString("pt-BR")}</div>
                <CardDescription className="mt-1">Tarefas criadas</CardDescription>
              </CardContent>
            </Card>

            {/* Tarefas Concluídas */}
            <Card className="bg-card border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.done.toLocaleString("pt-BR")}
                </div>
                <CardDescription className="mt-1">
                  {stats.total > 0
                    ? `${Math.round((stats.done / stats.total) * 100)}% do total`
                    : "0% do total"}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Tarefas Em Aberto */}
            <Card className="bg-card border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Aberto</CardTitle>
                <Circle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.open.toLocaleString("pt-BR")}
                </div>
                <CardDescription className="mt-1">
                  {stats.total > 0
                    ? `${Math.round((stats.open / stats.total) * 100)}% do total`
                    : "0% do total"}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
