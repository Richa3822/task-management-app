import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { tasksApi } from '../api/tasks.api';
import type {
  TaskQueryParams,
  CreateTaskPayload,
  UpdateTaskPayload,
  PaginatedTasksResponse,
} from '../types/task.types';

const TASKS_QUERY_KEY = 'tasks';

export function useTasksQuery(params: TaskQueryParams) {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, params],
    queryFn: () => tasksApi.getAll(params),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => tasksApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      toast.success('Task created successfully');
    },
    onError: () => {
      toast.error('Failed to create task');
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
      tasksApi.update(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: [TASKS_QUERY_KEY] });

      const previousQueries = queryClient.getQueriesData<PaginatedTasksResponse>({
        queryKey: [TASKS_QUERY_KEY],
      });

      queryClient.setQueriesData<PaginatedTasksResponse>(
        { queryKey: [TASKS_QUERY_KEY] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((task) =>
              task._id === id ? { ...task, ...payload } : task,
            ),
          };
        },
      );

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error('Failed to update task');
    },
    onSuccess: () => {
      toast.success('Task updated');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      toast.success('Task deleted');
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });
}