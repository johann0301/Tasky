"use client";

import { TaskList } from "@/features/TaskManager/components/TaskList";
import { TaskFormDialog } from "@/features/TaskManager/components/TaskFormDialog";
import { Button } from "@/shared/components/button";
import { Plus } from "lucide-react";
import { useTaskStore } from "@/features/TaskManager/store/taskStore";

export default function TasksPage() {
  const openCreateModal = useTaskStore((state) => state.openCreateModal);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie suas tarefas de forma eficiente
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>
      <TaskList />
      <TaskFormDialog />
    </div>
  );
}
