import { apiClient } from './axios';
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskQueryParams,
  PaginatedTasksResponse,
} from '../types/task.types';

export const tasksApi = {
  getAll: async (params: TaskQueryParams): Promise<PaginatedTasksResponse> => {
    const { data } = await apiClient.get<PaginatedTasksResponse>('/tasks', { params });
    return data;
  },

  getOne: async (id: string): Promise<Task> => {
    const { data } = await apiClient.get<Task>(`/tasks/${id}`);
    return data;
  },

  create: async (payload: CreateTaskPayload): Promise<Task> => {
    const { data } = await apiClient.post<Task>('/tasks', payload);
    return data;
  },

  update: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await apiClient.put<Task>(`/tasks/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};