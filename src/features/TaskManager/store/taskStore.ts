import { create } from "zustand";
import type { TaskStatus, TaskPriority } from "../types";

// Re-export types from types.ts to maintain compatibility
export type { TaskStatus, TaskPriority } from "../types";

// Specific types for the store
export type SortField = "createdAt" | "updatedAt" | "dueDate" | "title" | "priority" | "status";
export type SortDirection = "asc" | "desc";
export type ViewMode = "list" | "kanban";

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

interface TaskState {
  viewMode: ViewMode;
  
  filters: TaskFilters;
  
  sortField: SortField;
  sortDirection: SortDirection;

  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  editingTaskId: string | null;
}

interface TaskActions {

  setViewMode: (mode: ViewMode) => void;
  
  setFilter: (filter: Partial<TaskFilters>) => void;
  clearFilters: () => void;
  
  setSort: (field: SortField, direction?: SortDirection) => void;
  toggleSortDirection: () => void;
  
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (taskId: string) => void;
  closeEditModal: () => void;
  openDeleteModal: (taskId: string) => void;
  closeDeleteModal: () => void;
  closeAllModals: () => void;
}

type TaskStore = TaskState & TaskActions;

const initialState: TaskState = {
  viewMode: "list",
  filters: {},
  sortField: "createdAt",
  sortDirection: "desc",
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  editingTaskId: null,
};

export const useTaskStore = create<TaskStore>((set) => ({
  ...initialState,

  setViewMode: (mode) =>
    set({
      viewMode: mode,
    }),

  setFilter: (filter) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filter,
      },
    })),

  clearFilters: () =>
    set({
      filters: {},
    }),

  setSort: (field, direction) =>
    set({
      sortField: field,
      sortDirection: direction ?? "desc",
    }),

  toggleSortDirection: () =>
    set((state) => ({
      sortDirection: state.sortDirection === "asc" ? "desc" : "asc",
    })),

  openCreateModal: () =>
    set({
      isCreateModalOpen: true,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      editingTaskId: null,
    }),

  closeCreateModal: () =>
    set({
      isCreateModalOpen: false,
    }),

  openEditModal: (taskId) =>
    set({
      isEditModalOpen: true,
      isCreateModalOpen: false,
      isDeleteModalOpen: false,
      editingTaskId: taskId,
    }),

  closeEditModal: () =>
    set({
      isEditModalOpen: false,
      editingTaskId: null,
    }),

  openDeleteModal: (taskId) =>
    set({
      isDeleteModalOpen: true,
      isCreateModalOpen: false,
      isEditModalOpen: false,
      editingTaskId: taskId,
    }),

  closeDeleteModal: () =>
    set({
      isDeleteModalOpen: false,
      editingTaskId: null,
    }),

  closeAllModals: () =>
    set({
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      editingTaskId: null,
    }),
}));
