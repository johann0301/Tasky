"use client";

import { trpc } from "@/lib/trpc";
import { TaskCard } from "./TaskCard";
import { useTaskStore } from "../store/taskStore";
import { TaskListLoading, TaskListError, TaskListEmpty } from "@/shared/components/TaskListStates";

export function TaskList() {
  const filters = useTaskStore((state) => state.filters);

  const { data: tasks, isLoading, error } = trpc.task.getAll.useQuery(filters);

  if (isLoading) {
    return <TaskListLoading />;
  }

  if (error) {
    return <TaskListError error={error} />;
  }

  if (!tasks || tasks.length === 0) {
    return <TaskListEmpty hasFilters={Object.keys(filters).length > 0} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
