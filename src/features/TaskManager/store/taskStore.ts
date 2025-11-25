import { create } from "zustand";

// Types
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type SortField = "createdAt" | "updatedAt" | "dueDate" | "title" | "priority" | "status";
export type SortDirection = "asc" | "desc";
export type ViewMode = "list" | "kanban";

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

interface TaskState {
  // Modo de visualização
  viewMode: ViewMode;
  
  // Filtros
  filters: TaskFilters;
  
  // Ordenação
  sortField: SortField;
  sortDirection: SortDirection;
  
  // Visibilidade de modais
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  editingTaskId: string | null;
}

interface TaskActions {
  // Modo de visualização
  setViewMode: (mode: ViewMode) => void;
  
  // Filtros
  setFilter: (filter: Partial<TaskFilters>) => void;
  clearFilters: () => void;
  
  // Ordenação
  setSort: (field: SortField, direction?: SortDirection) => void;
  toggleSortDirection: () => void;
  
  // Modais
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

  // Modo de visualização
  setViewMode: (mode) =>
    set({
      viewMode: mode,
    }),

  // Filtros
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

  // Ordenação
  setSort: (field, direction) =>
    set({
      sortField: field,
      sortDirection: direction ?? "desc",
    }),

  toggleSortDirection: () =>
    set((state) => ({
      sortDirection: state.sortDirection === "asc" ? "desc" : "asc",
    })),

  // Modais
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
