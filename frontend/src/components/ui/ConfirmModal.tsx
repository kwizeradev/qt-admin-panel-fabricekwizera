import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const iconColor = variant === 'danger' ? 'text-red-600' : 'text-yellow-600';
  const bgColor = variant === 'danger' ? 'bg-red-50' : 'bg-yellow-50';

  const footer = (
    <div className="flex justify-end gap-3">
      <Button variant="secondary" onClick={onClose}>
        {cancelText}
      </Button>
      <Button
        variant={variant === 'danger' ? 'danger' : 'primary'}
        onClick={handleConfirm}
      >
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
    >
      <div className="flex gap-4">
        <div className={`p-2 rounded-full ${bgColor} flex-shrink-0`}>
          <AlertTriangle className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;