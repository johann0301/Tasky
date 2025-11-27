import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../types";
import { TaskKanbanCard } from "./TaskKanbanCard";

interface DraggableTaskCardProps {
  task: Task;
}

export function DraggableTaskCard({ task }: DraggableTaskCardProps) {
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

