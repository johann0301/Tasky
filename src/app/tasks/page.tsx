import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { TasksPageClient } from "@/features/TaskManager/components/TasksPageClient";
import "server-only";

export default async function TasksPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return <TasksPageClient />;
}
