'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      border: 'border-green-500 dark:border-green-500',
      text: 'text-green-800 dark:text-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-red-500 dark:border-red-500',
      text: 'text-red-800 dark:text-red-200',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      border: 'border-blue-500 dark:border-blue-500',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
  };

  const style = styles[toast.type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg ${style.bg} ${style.border} ${style.text} animate-slide-in-right`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
      <p className="flex-1 text-sm font-medium break-words">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity p-1"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      aria-label="Notifications"
    >
      <div className="pointer-events-auto space-y-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
    </div>
  );
}
