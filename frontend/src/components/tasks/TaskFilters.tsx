import { motion } from 'framer-motion';
import { TaskStatus } from '../../types/task.types';

type FilterValue = TaskStatus | 'all';

interface TaskFiltersProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  counts: { all: number; pending: number; completed: number };
}

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: TaskStatus.PENDING },
  { label: 'Completed', value: TaskStatus.COMPLETED },
];

export function TaskFilters({ value, onChange, counts }: TaskFiltersProps) {
  return (
    <div className="flex gap-2 rounded-xl bg-gray-100 p-1">
      {FILTERS.map((filter) => {
        const isActive = value === filter.value;
        const count =
          filter.value === 'all' ? counts.all : filter.value === TaskStatus.PENDING ? counts.pending : counts.completed;

        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="filter-pill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-accent"
                transition={{ type: 'spring', duration: 0.4 }}
              />
            )}
            <span className="relative z-10">
              {filter.label} <span className="opacity-75">({count})</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}