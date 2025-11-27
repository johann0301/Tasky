import { useDroppable } from "@dnd-kit/core";
import type { Task, TaskStatus } from "../types";
import { DraggableTaskCard } from "./DraggableTaskCard";

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  isOver: boolean;
}

export function KanbanColumn({ status, title, tasks, isOver }: KanbanColumnProps) {
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
        className={`flex-1 min-h-[200px] rounded-lg border-2 border-dashed p-4 transition-colors flex flex-col ${
          isOver
            ? "border-primary bg-primary/5"
            : "border-muted bg-muted/50"
        }`}
      >
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma tarefa
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {tasks.map((task) => (
              <DraggableTaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

