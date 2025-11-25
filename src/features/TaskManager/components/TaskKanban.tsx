"use client";

import { trpc } from "@/lib/trpc";
import { TaskKanbanCard, type Task } from "./TaskKanbanCard";
import { useTaskStore } from "../store/taskStore";
import { Loader2 } from "lucide-react";
import { TaskStatus } from "../store/taskStore";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { useState } from "react";
import { toast } from "sonner";

const columns: { status: TaskStatus; title: string }[] = [
  { status: "todo", title: "A Fazer" },
  { status: "in-progress", title: "Em Progresso" },
  { status: "done", title: "Concluídas" },
];

export function TaskKanban() {
  const filters = useTaskStore((state) => state.filters);
  const utils = trpc.useUtils();

  // Remover filtro de status para mostrar todas as tarefas nas colunas
  const { status: statusFilter, ...otherFilters } = filters;

  const { data: tasks, isLoading, error } = trpc.task.getAll.useQuery(otherFilters);

  // Estado para o drag
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const activeTask = activeId ? tasks?.find((t) => t.id === activeId) : null;

  // Sensores para drag (pointer para mouse e touch)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Precisa mover 8px antes de iniciar drag
      },
    })
  );

  // Mutation para atualizar status
  const updateMutation = trpc.task.update.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
      toast.success("Tarefa movida com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao mover tarefa");
      // Revalidar para reverter visual
      utils.task.getAll.invalidate();
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string | null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Buscar a tarefa atual
    const task = tasks?.find((t) => t.id === taskId);
    if (!task) return;

    // Se o status não mudou, não fazer nada
    if (task.status === newStatus) return;

    // Validar se o novo status é válido
    const validStatuses: TaskStatus[] = ["todo", "in-progress", "done"];
    if (!validStatuses.includes(newStatus)) return;

    // Atualizar status otimisticamente e na API
    updateMutation.mutate({
      id: taskId,
      status: newStatus,
    });
  };

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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.status] || [];
          return (
            <KanbanColumn
              key={column.status}
              status={column.status}
              title={column.title}
              tasks={columnTasks as Task[]}
              isOver={overId === column.status}
            />
          );
        })}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-50">
            <TaskKanbanCard task={activeTask as Task} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// Componente de coluna droppable
function KanbanColumn({
  status,
  title,
  tasks,
  isOver,
}: {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}
        </p>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] rounded-lg border-2 border-dashed p-4 transition-colors ${
          isOver
            ? "border-primary bg-primary/5"
            : "border-muted bg-muted/20"
        }`}
      >
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma tarefa
          </p>
        ) : (
          tasks.map((task) => <DraggableTaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}

// Componente de card draggable
function DraggableTaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={isDragging ? "opacity-50" : ""}
    >
      <TaskKanbanCard task={task} />
    </div>
  );
}
