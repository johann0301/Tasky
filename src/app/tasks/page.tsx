import { TaskList } from "@/features/TaskManager/components/TaskList";

export default function TasksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie suas tarefas de forma eficiente
        </p>
      </div>
      <TaskList />
    </div>
  );
}
