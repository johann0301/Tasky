import { notFound, redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { tasks } from "@/database/schema";
import { auth } from "@/lib/auth";
import { Button } from "@/shared/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/card";
import { ArrowLeft, Calendar, Flag, CheckCircle2, Circle, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import "server-only";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusConfig = {
  todo: {
    label: "A fazer",
    icon: Circle,
    color: "text-muted-foreground",
  },
  "in-progress": {
    label: "Em progresso",
    icon: Clock,
    color: "text-blue-600",
  },
  done: {
    label: "Concluída",
    icon: CheckCircle2,
    color: "text-green-600",
  },
} as const;

const priorityConfig = {
  low: {
    label: "Baixa",
    color: "text-gray-600",
    flagColor: "text-gray-500",
  },
  medium: {
    label: "Média",
    color: "text-yellow-600",
    flagColor: "text-yellow-500",
  },
  high: {
    label: "Alta",
    color: "text-red-600",
    flagColor: "text-red-500",
  },
} as const;

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // Verificar autenticação
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Buscar task no banco
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
    .limit(1);

  if (!task) {
    notFound();
  }

  const statusInfo = statusConfig[task.status as keyof typeof statusConfig];
  const priorityInfo = priorityConfig[task.priority as keyof typeof priorityConfig];
  const StatusIcon = statusInfo.icon;

  const isOverdue = task.dueDate && task.status !== "done" && new Date(task.dueDate) < new Date();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para lista
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{task.title}</CardTitle>
          {task.description && (
            <CardDescription className="text-base mt-2">
              {task.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status e Prioridade */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
              <span className={`font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Flag className={`h-5 w-5 ${priorityInfo.flagColor}`} />
              <span className={`font-medium ${priorityInfo.color}`}>
                Prioridade: {priorityInfo.label}
              </span>
            </div>
          </div>

          {/* Data de Vencimento */}
          {task.dueDate && (
            <div className={`flex items-center gap-2 ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
              <Calendar className="h-5 w-5" />
              <div>
                <p className="font-medium">Data de Vencimento</p>
                <p>
                  {format(new Date(task.dueDate), "dd 'de' MMMM 'de' yyyy")}
                  {isOverdue && <span className="font-semibold"> (Atrasada)</span>}
                </p>
              </div>
            </div>
          )}

          {/* Datas de Criação e Atualização */}
          <div className="border-t pt-6 space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium">Criada em:</span>{" "}
              {format(new Date(task.createdAt), "dd/MM/yyyy 'às' HH:mm")}
            </p>
            {task.updatedAt && task.updatedAt.getTime() !== task.createdAt.getTime() && (
              <p>
                <span className="font-medium">Atualizada em:</span>{" "}
                {format(new Date(task.updatedAt), "dd/MM/yyyy 'às' HH:mm")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
