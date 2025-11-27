"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/card";
import { Button } from "@/shared/components/button";
import { TaskStatus, TaskPriority, type Task } from "../types";
import { 
  Calendar, 
  Flag, 
  MoreVertical,
  Edit2,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { useTaskStore } from "../store/taskStore";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu";

interface TaskKanbanCardProps {
  task: Task;
}

const priorityConfig = {
  low: {
    label: "Baixa",
    color: "text-gray-600",
    flagColor: "text-gray-500",
  },
  medium: {
    label: "Média",
    color: "text-yellow-600",
    flagColor: "text-yellow-500",
  },
  high: {
    label: "Alta",
    color: "text-red-600",
    flagColor: "text-red-500",
  },
} as const;

export function TaskKanbanCard({ task }: TaskKanbanCardProps) {
  const openEditModal = useTaskStore((state) => state.openEditModal);
  const openDeleteModal = useTaskStore((state) => state.openDeleteModal);

  const priorityInfo = priorityConfig[task.priority];

  const isOverdue = task.dueDate && task.status !== "done" && new Date(task.dueDate) < new Date();

  return (
    <Card className="bg-card border shadow-sm hover:shadow-md transition-all mb-3">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/tasks/${task.id}`}>
              <CardTitle className="text-base font-semibold line-clamp-2 hover:underline cursor-pointer">
                {task.title}
              </CardTitle>
            </Link>
            {task.description && (
              <CardDescription className="mt-2 text-muted-foreground line-clamp-2 text-xs">
                {task.description}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditModal(task.id)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDeleteModal(task.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Priority */}
        <div className="flex items-center gap-1.5 text-xs">
          <Flag className={`h-3 w-3 ${priorityInfo.flagColor}`} />
          <span className={priorityInfo.color}>{priorityInfo.label}</span>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
            <Calendar className="h-3 w-3" />
              <span>
              {format(new Date(task.dueDate), "dd MMM")}
              {isOverdue && " ⚠"}
            </span>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
