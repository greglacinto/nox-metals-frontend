'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000
}) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-400',
          IconComponent: CheckCircle
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-400',
          IconComponent: XCircle
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-400',
          IconComponent: AlertCircle
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-400',
          IconComponent: AlertCircle
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-400',
          IconComponent: AlertCircle
        };
    }
  };

  const styles = getToastStyles();
  const IconComponent = styles.IconComponent;

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4 max-w-sm transition-all duration-300 ${
          isShowing ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <div className="flex items-start">
          <IconComponent className={`h-5 w-5 ${styles.icon} mt-0.5 mr-3 flex-shrink-0`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
          </div>
          <button
            onClick={() => {
              setIsShowing(false);
              setTimeout(onClose, 300);
            }}
            className={`ml-3 ${styles.text} hover:opacity-70 transition-opacity`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast; 