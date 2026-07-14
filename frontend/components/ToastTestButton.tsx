'use client';

import { useToast } from './ToastProvider';

export default function ToastTestButton() {
  const { addToast } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => addToast('This is a success message!', 'success')}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Success Toast
      </button>
      <button
        onClick={() => addToast('This is an error message!', 'error')}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Error Toast
      </button>
      <button
        onClick={() => addToast('This is an info message!', 'info')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Info Toast
      </button>
      <button
        onClick={() => {
          addToast('First notification', 'info');
          setTimeout(() => addToast('Second notification', 'success'), 500);
          setTimeout(() => addToast('Third notification', 'error'), 1000);
        }}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Multiple Toasts
      </button>
    </div>
  );
}
