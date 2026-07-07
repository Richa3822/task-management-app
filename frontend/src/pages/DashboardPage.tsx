import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskTable, type SortField, type SortDirection } from '../components/tasks/TaskTable';
import { TaskForm } from '../components/tasks/TaskForm';
import { DeleteConfirmModal } from '../components/tasks/DeleteConfirmModal';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import {
  useTasksQuery,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '../hooks/useTasks';
import { TaskStatus, type Task } from '../types/task.types';
import type { TaskFormValues } from '../utils/validation';

type StatusFilter = TaskStatus | 'all';

export function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const { data, isLoading } = useTasksQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
    page: 1,
    limit: 100,
  });

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const tasks = data?.data ?? [];

  const counts = useMemo(() => {
    return {
      all: tasks.length,
      pending: tasks.filter((t) => t.status === TaskStatus.PENDING).length,
      completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
    };
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [tasks, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleToggleStatus = (task: Task) => {
    const newStatus =
      task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED;
    updateTask.mutate({ id: task._id, payload: { status: newStatus } });
  };

  const handleCreateSubmit = async (values: TaskFormValues) => {
    await createTask.mutateAsync(values);
    setIsFormOpen(false);
  };

  const handleEditSubmit = async (values: TaskFormValues) => {
    if (!editingTask) return;
    await updateTask.mutateAsync({ id: editingTask._id, payload: values });
    setEditingTask(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    await deleteTask.mutateAsync(deletingTask._id);
    setDeletingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-sm text-gray-500">
              {counts.pending} pending, {counts.completed} completed
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        <div className="mb-5">
          <TaskFilters value={statusFilter} onChange={setStatusFilter} counts={counts} />
        </div>

        <TaskTable
          tasks={sortedTasks}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onToggleStatus={handleToggleStatus}
          onEdit={setEditingTask}
          onDelete={setDeletingTask}
          isLoading={isLoading}
        />
      </main>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Create task">
        <TaskForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={createTask.isPending}
          submitLabel="Create task"
        />
      </Modal>

      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit task"
      >
        {editingTask && (
          <TaskForm
            defaultValues={{
              title: editingTask.title,
              description: editingTask.description,
            }}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingTask(null)}
            isSubmitting={updateTask.isPending}
            submitLabel="Save changes"
          />
        )}
      </Modal>

      <DeleteConfirmModal
        isOpen={!!deletingTask}
        taskTitle={deletingTask?.title ?? ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTask(null)}
        isDeleting={deleteTask.isPending}
      />
    </div>
  );
}