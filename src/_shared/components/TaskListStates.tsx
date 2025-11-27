import { Loader2 } from "lucide-react";

interface TaskListLoadingProps {
  message?: string;
}

export function TaskListLoading({ message = "Carregando tarefas..." }: TaskListLoadingProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      {message && <p className="ml-2 text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}

interface TaskListErrorProps {
  message?: string;
  error?: { message?: string } | null;
}

export function TaskListError({ 
  message = "Erro ao carregar tarefas",
  error 
}: TaskListErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-lg font-semibold text-destructive">{message}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {error?.message || "Tente novamente mais tarde"}
      </p>
    </div>
  );
}

interface TaskListEmptyProps {
  hasFilters: boolean;
  message?: string;
  filterMessage?: string;
}

export function TaskListEmpty({ 
  hasFilters, 
  message = "Crie sua primeira tarefa para começar",
  filterMessage = "Tente ajustar os filtros ou criar uma nova tarefa"
}: TaskListEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-lg font-semibold">Nenhuma tarefa encontrada</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {hasFilters ? filterMessage : message}
      </p>
    </div>
  );
}

