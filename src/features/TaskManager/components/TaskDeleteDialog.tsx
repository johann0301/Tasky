"use client";

import { useTaskStore } from "../store/taskStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/dialog";
import { Button } from "@/shared/components/button";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function TaskDeleteDialog() {
  const isDeleteModalOpen = useTaskStore((state) => state.isDeleteModalOpen);
  const editingTaskId = useTaskStore((state) => state.editingTaskId);
  const closeDeleteModal = useTaskStore((state) => state.closeDeleteModal);

  const utils = trpc.useUtils();

  const { data: task, isLoading } = trpc.task.getById.useQuery(
    { id: editingTaskId! },
    {
      enabled: isDeleteModalOpen && !!editingTaskId,
    }
  );

  const deleteMutation = trpc.task.delete.useMutation({
    onSuccess: () => {
      toast.success("Tarefa excluída com sucesso!");
      utils.task.getAll.invalidate();
      closeDeleteModal();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir tarefa");
    },
  });

  const handleDelete = () => {
    if (editingTaskId) {
      deleteMutation.mutate({ id: editingTaskId });
    }
  };

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Excluir Tarefa
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. A tarefa será permanentemente removida.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Você está prestes a excluir a tarefa: <strong>{task?.title}</strong>
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                disabled={deleteMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  "Excluir"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

