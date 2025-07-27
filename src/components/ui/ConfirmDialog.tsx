'use client';

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation action failed:', error);
    }
  };

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          button: 'danger'
        };
      case 'warning':
        return {
          icon: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          button: 'secondary'
        };
      case 'info':
        return {
          icon: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          button: 'primary'
        };
      default:
        return {
          icon: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          button: 'danger'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className={`p-6 ${styles.bg} ${styles.border} border-b rounded-t-lg`}>
          <div className="flex items-center">
            <AlertTriangle className={`h-6 w-6 ${styles.icon} mr-3`} />
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">{message}</p>

          {/* Actions */}
          <div className="flex space-x-3 justify-end">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={styles.button as 'primary' | 'secondary' | 'danger'}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 