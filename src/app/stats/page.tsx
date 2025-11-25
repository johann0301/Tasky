import { db } from "@/lib/db";
import { tasks, users } from "@/database/schema";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/card";
import { BarChart3, CheckCircle2, Clock, Circle, Users } from "lucide-react";
import type { Metadata } from "next";
import "server-only";

// ISR: Revalidar a cada 60 segundos
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Estatísticas - Tasky",
  description:
    "Acompanhe as estatísticas gerais da plataforma Tasky. Veja quantas tarefas foram criadas, quantos usuários estão cadastrados e como as tarefas estão distribuídas por status.",
  keywords: ["estatísticas", "métricas", "tasks", "tasky", "dashboard"],
  openGraph: {
    title: "Estatísticas - Tasky",
    description: "Acompanhe as estatísticas gerais da plataforma Tasky em tempo real.",
    type: "website",
  },
};

interface StatsData {
  totalTasks: number;
  totalUsers: number;
  tasksByStatus: {
    todo: number;
    "in-progress": number;
    done: number;
  };
}

async function getStats(): Promise<StatsData> {
  try {
    // Contar total de tarefas
    const [totalTasksResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(tasks);

    // Contar total de usuários
    const [totalUsersResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users);

    // Contar tarefas por status
    const tasksByStatusResult = await db
      .select({
        status: tasks.status,
        count: sql<number>`count(*)::int`,
      })
      .from(tasks)
      .groupBy(tasks.status);

    // Organizar por status
    const tasksByStatus = {
      todo: 0,
      "in-progress": 0,
      done: 0,
    };

    tasksByStatusResult.forEach((item) => {
      if (item.status === "todo") tasksByStatus.todo = item.count;
      if (item.status === "in-progress") tasksByStatus["in-progress"] = item.count;
      if (item.status === "done") tasksByStatus.done = item.count;
    });

    return {
      totalTasks: totalTasksResult?.count ?? 0,
      totalUsers: totalUsersResult?.count ?? 0,
      tasksByStatus,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    // Retornar valores padrão em caso de erro
    return {
      totalTasks: 0,
      totalUsers: 0,
      tasksByStatus: {
        todo: 0,
        "in-progress": 0,
        done: 0,
      },
    };
  }
}

export default async function StatsPage() {
  const stats = await getStats();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Estatísticas da Plataforma</h1>
        <p className="text-lg text-muted-foreground">
          Acompanhe as métricas gerais do Tasky em tempo real
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Atualizado a cada 60 segundos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total de Tarefas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks.toLocaleString("pt-BR")}</div>
            <CardDescription className="mt-1">
              Tarefas criadas na plataforma
            </CardDescription>
          </CardContent>
        </Card>

        {/* Total de Usuários */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString("pt-BR")}</div>
            <CardDescription className="mt-1">
              Usuários cadastrados
            </CardDescription>
          </CardContent>
        </Card>

        {/* Tarefas A Fazer */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Fazer</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.tasksByStatus.todo.toLocaleString("pt-BR")}
            </div>
            <CardDescription className="mt-1">
              {stats.totalTasks > 0
                ? `${Math.round((stats.tasksByStatus.todo / stats.totalTasks) * 100)}% do total`
                : "0% do total"}
            </CardDescription>
          </CardContent>
        </Card>

        {/* Tarefas Em Progresso */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.tasksByStatus["in-progress"].toLocaleString("pt-BR")}
            </div>
            <CardDescription className="mt-1">
              {stats.totalTasks > 0
                ? `${Math.round((stats.tasksByStatus["in-progress"] / stats.totalTasks) * 100)}% do total`
                : "0% do total"}
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Tarefas Concluídas - Card maior */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Tarefas Concluídas</CardTitle>
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">
            {stats.tasksByStatus.done.toLocaleString("pt-BR")}
          </div>
          <CardDescription className="mt-2 text-base">
            {stats.totalTasks > 0
              ? `${Math.round((stats.tasksByStatus.done / stats.totalTasks) * 100)}% de todas as tarefas foram concluídas`
              : "Ainda não há tarefas concluídas"}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

