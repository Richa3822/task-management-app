import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowUpDown, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TaskStatus, type Task } from '../../types/task.types';

export type SortField = 'title' | 'status' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

interface TaskTableProps {
  tasks: Task[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  isLoading: boolean;
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 text-gray-300" />;
  return direction === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5 text-primary" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-primary" />
  );
}

export function TaskTable({
  tasks,
  sortField,
  sortDirection,
  onSort,
  onToggleStatus,
  onEdit,
  onDelete,
  isLoading,
}: TaskTableProps) {
  const columns: { key: SortField; label: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created' },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
          <CheckCircle2 className="h-7 w-7 text-gray-300" />
        </div>
        <p className="font-medium text-gray-500">No tasks here yet</p>
        <p className="text-sm text-gray-400">Create your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-3 text-left">
                <button
                  onClick={() => onSort(col.key)}
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-700"
                >
                  {col.label}
                  <SortIcon active={sortField === col.key} direction={sortDirection} />
                </button>
              </th>
            ))}
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.tr
                key={task._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
              >
                <td className="px-5 py-4">
                  <button
                    onClick={() => onToggleStatus(task)}
                    className="flex items-center gap-2.5 text-left"
                  >
                    {task.status === TaskStatus.COMPLETED ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-gray-300" />
                    )}
                    <span
                      className={`font-medium ${
                        task.status === TaskStatus.COMPLETED
                          ? 'text-gray-400 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </span>
                  </button>
                  {task.description && (
                    <p className="ml-7 mt-0.5 truncate text-xs text-gray-400">
                      {task.description}
                    </p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      task.status === TaskStatus.COMPLETED
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {task.status === TaskStatus.COMPLETED ? 'Completed' : 'Pending'}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">
                  {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(task)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(task)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}