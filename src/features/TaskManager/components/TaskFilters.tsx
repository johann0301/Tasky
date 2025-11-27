"use client";

import { Input } from "@/shared/components/input";
import { Button } from "@/shared/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/select";
import { useTaskStore, type TaskStatus, type TaskPriority } from "../store/taskStore";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export function TaskFilters() {
  const filters = useTaskStore((state) => state.filters);
  const setFilter = useTaskStore((state) => state.setFilter);
  const clearFilters = useTaskStore((state) => state.clearFilters);

  const [searchValue, setSearchValue] = useState(filters.search || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        setFilter({ search: searchValue || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search, setFilter]);

  const hasActiveFilters = !!(
    filters.status ||
    filters.priority ||
    filters.search
  );

  return (
    <div className="mb-6 space-y-4 rounded-lg border bg-card shadow-sm p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Search */}
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas por título ou descrição..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Status */}
        <div className="w-full md:w-[180px]">
          <label className="mb-2 block text-sm font-medium">Status</label>
          <Select
            value={filters.status || undefined}
            onValueChange={(value) =>
              setFilter({ status: value as TaskStatus })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">A fazer</SelectItem>
              <SelectItem value="in-progress">Em progresso</SelectItem>
              <SelectItem value="done">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="w-full md:w-[180px]">
          <label className="mb-2 block text-sm font-medium">Prioridade</label>
          <Select
            value={filters.priority || undefined}
            onValueChange={(value) =>
              setFilter({ priority: value as TaskPriority })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={() => {
              clearFilters();
              setSearchValue("");
            }}
            className="w-full md:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
}

