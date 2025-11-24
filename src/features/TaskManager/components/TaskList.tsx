"use client";

import { trpc } from "@/lib/trpc";
import { TaskCard, type Task } from "./TaskCard";
import { useTaskStore } from "../store/taskStore";
import { Loader2 } from "lucide-react";

export function TaskList() {
  const filters = useTaskStore((state) => state.filters);

  const { data: tasks, isLoading, error } = trpc.task.getAll.useQuery(filters);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-semibold text-destructive">
          Erro ao carregar tarefas
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "Tente novamente mais tarde"}
        </p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-semibold">Nenhuma tarefa encontrada</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {Object.keys(filters).length > 0
            ? "Tente ajustar os filtros ou criar uma nova tarefa"
            : "Crie sua primeira tarefa para começar"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task as Task} />
      ))}
    </div>
  );
}
