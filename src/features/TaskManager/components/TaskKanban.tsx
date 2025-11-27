"use client";

import { trpc } from "@/lib/trpc";
import { TaskKanbanCard } from "./TaskKanbanCard";
import { useTaskStore } from "../store/taskStore";
import { TaskStatus, type Task } from "../types";
import { TaskListLoading, TaskListError, TaskListEmpty } from "@/shared/components/TaskListStates";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { toast } from "sonner";
import { KanbanColumn } from "./KanbanColumn";

const columns: { status: TaskStatus; title: string }[] = [
  { status: "todo", title: "A Fazer" },
  { status: "in-progress", title: "Em Progresso" },
  { status: "done", title: "Concluídas" },
];

export function TaskKanban() {
  const filters = useTaskStore((state) => state.filters);
  const utils = trpc.useUtils();

  // Remove filter, show all tasks in columns
  const { status: statusFilter, ...otherFilters } = filters;

  const { data: tasks, isLoading, error } = trpc.task.getAll.useQuery(otherFilters);

  // drag
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const activeTask = activeId ? tasks?.find((t) => t.id === activeId) : null;

  // drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    })
  );

  // Mutation to update status
  const updateMutation = trpc.task.update.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
      toast.success("Tarefa movida com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao mover tarefa");
      utils.task.getAll.invalidate();
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over ? String(event.over.id) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = String(over.id) as TaskStatus;

    const task = tasks?.find((t) => t.id === taskId);
    if (!task) return;

    if (task.status === newStatus) return;

    const validStatuses: TaskStatus[] = ["todo", "in-progress", "done"];
    if (!validStatuses.includes(newStatus)) return;

    // Update status optimistically and in the API
    updateMutation.mutate({
      id: taskId,
      status: newStatus,
    });
  };

  if (isLoading) {
    return <TaskListLoading />;
  }

  if (error) {
    return <TaskListError error={error} />;
  }

  if (!tasks || tasks.length === 0) {
    return <TaskListEmpty hasFilters={Object.keys(otherFilters).length > 0} />;
  }

  // Group by status
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
              tasks={columnTasks}
              isOver={overId === column.status}
            />
          );
        })}
      </div>
      <DragOverlay>
        {activeTask && (
          <div className="opacity-50">
            <TaskKanbanCard task={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
