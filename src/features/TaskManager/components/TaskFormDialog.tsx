"use client";

import { useTaskStore } from "../store/taskStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/dialog";
import { TaskForm } from "./TaskForm";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export function TaskFormDialog() {
  const isCreateModalOpen = useTaskStore((state) => state.isCreateModalOpen);
  const isEditModalOpen = useTaskStore((state) => state.isEditModalOpen);
  const editingTaskId = useTaskStore((state) => state.editingTaskId);
  const closeCreateModal = useTaskStore((state) => state.closeCreateModal);
  const closeEditModal = useTaskStore((state) => state.closeEditModal);

  const { data: task, isLoading } = trpc.task.getById.useQuery(
    { id: editingTaskId! },
    {
      enabled: isEditModalOpen && !!editingTaskId,
    }
  );

  const isOpen = isCreateModalOpen || isEditModalOpen;
  const isEditing = isEditModalOpen && !!editingTaskId;

  const handleClose = () => {
    if (isEditing) {
      closeEditModal();
    } else {
      closeCreateModal();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações da tarefa abaixo."
              : "Preencha os dados abaixo para criar uma nova tarefa."}
          </DialogDescription>
        </DialogHeader>
        {isEditing && isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TaskForm 
            task={isEditing && task ? {
              id: task.id,
              title: task.title,
              description: task.description,
              status: task.status as "todo" | "in-progress" | "done",
              priority: task.priority as "low" | "medium" | "high",
              dueDate: task.dueDate ? new Date(task.dueDate) : null,
              createdAt: new Date(task.createdAt),
              updatedAt: new Date(task.updatedAt),
              userId: task.userId,
            } : undefined} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
