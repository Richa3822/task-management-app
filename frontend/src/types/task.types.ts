export const TaskStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed',
  } as const;
  
  export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
  
  export interface Task {
    _id: string;
    title: string;
    description: string;
    status: TaskStatus;
    owner: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateTaskPayload {
    title: string;
    description?: string;
    status?: TaskStatus;
  }
  
  export type UpdateTaskPayload = Partial<CreateTaskPayload>;
  
  export interface TaskQueryParams {
    status?: TaskStatus;
    page?: number;
    limit?: number;
  }
  
  export interface PaginatedTasksResponse {
    data: Task[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      counts: {
        all: number;
        pending: number;
        completed: number;
      };
    };
  } 