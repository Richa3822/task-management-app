import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete task">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-gray-700">
            Are you sure you want to delete <span className="font-semibold">"{taskTitle}"</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}