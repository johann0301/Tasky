"use client";

import { trpc } from "@/lib/trpc";
import { TaskKanbanCard, type Task } from "./TaskKanbanCard";
import { useTaskStore } from "../store/taskStore";
import { Loader2 } from "lucide-react";
import { TaskStatus } from "../store/taskStore";

const columns: { status: TaskStatus; title: string }[] = [
  { status: "todo", title: "A Fazer" },
  { status: "in-progress", title: "Em Progresso" },
  { status: "done", title: "Concluídas" },
];

export function TaskKanban() {
  const filters = useTaskStore((state) => state.filters);

  // Remover filtro de status para mostrar todas as tarefas nas colunas
  const { status: statusFilter, ...otherFilters } = filters;

  const { data: tasks, isLoading, error } = trpc.task.getAll.useQuery(otherFilters);

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
          {Object.keys(otherFilters).length > 0
            ? "Tente ajustar os filtros ou criar uma nova tarefa"
            : "Crie sua primeira tarefa para começar"}
        </p>
      </div>
    );
  }

  // Agrupar tarefas por status
  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      const status = task.status as TaskStatus;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    },
    {} as Record<TaskStatus, typeof tasks>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => {
        const columnTasks = tasksByStatus[column.status] || [];
        return (
          <div key={column.status} className="flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                {column.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {columnTasks.length} {columnTasks.length === 1 ? "tarefa" : "tarefas"}
              </p>
            </div>
            <div className="flex-1 min-h-[200px] rounded-lg border-2 border-dashed border-muted p-4 bg-muted/20">
              {columnTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma tarefa
                </p>
              ) : (
                columnTasks.map((task) => (
                  <TaskKanbanCard key={task.id} task={task as Task} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
