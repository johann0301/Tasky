"use client";

import { TaskList } from "@/features/TaskManager/components/TaskList";
import { TaskKanban } from "@/features/TaskManager/components/TaskKanban";
import { TaskFilters } from "@/features/TaskManager/components/TaskFilters";
import { TaskFormDialog } from "@/features/TaskManager/components/TaskFormDialog";
import { Button } from "@/shared/components/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import { useTaskStore } from "@/features/TaskManager/store/taskStore";

export default function TasksPage() {
  const openCreateModal = useTaskStore((state) => state.openCreateModal);
  const viewMode = useTaskStore((state) => state.viewMode);
  const setViewMode = useTaskStore((state) => state.setViewMode);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie suas tarefas de forma eficiente
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-r-none"
            >
              <List className="mr-2 h-4 w-4" />
              Lista
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="rounded-l-none"
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Kanban
            </Button>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>
      <TaskFilters />
      {viewMode === "list" ? <TaskList /> : <TaskKanban />}
      <TaskFormDialog />
    </div>
  );
}
