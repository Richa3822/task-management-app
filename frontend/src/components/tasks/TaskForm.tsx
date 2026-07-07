import { useForm } from 'react-hook-form';
import { taskResolver, type TaskFormValues } from '../../utils/validation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TaskFormProps {
  defaultValues?: TaskFormValues;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function TaskForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: taskResolver,
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Title"
        placeholder="e.g. Finish quarterly report"
        error={errors.title?.message}
        {...register('title')}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          rows={3}
          placeholder="Add more details (optional)"
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          {...register('description')}
        />
      </div>
      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}