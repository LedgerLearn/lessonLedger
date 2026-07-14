'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useWebSocket } from '@/lib/useWebSocket';
import { SkeletonTaskList } from './skeletons';
import { useToast } from './ToastProvider';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  priority: string;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // WebSocket connection
  const { isConnected } = useWebSocket({
    url: WS_URL,
    token,
    onMessage: (message) => {
      console.log('WebSocket message received:', message);
      
      switch (message.type) {
        case 'task_created':
          setTasks((prev) => [...prev, message.data]);
          addToast('New task created successfully', 'success');
          break;
        case 'task_updated':
          setTasks((prev) =>
            prev.map((task) => (task.id === message.data.id ? message.data : task))
          );
          addToast('Task updated successfully', 'info');
          break;
        case 'task_deleted':
          setTasks((prev) => prev.filter((task) => task.id !== message.data.id));
          addToast('Task deleted successfully', 'info');
          break;
      }
    },
    onConnect: () => {
      console.log('WebSocket connected - real-time updates enabled');
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected - will attempt reconnection');
    },
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await api.getTasks();
      if (data) {
        setTasks(data as Task[]);
      }
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const handleToggleTask = async (id: string, completed: boolean) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
    
    const { data, error } = await api.updateTask(id, { completed: !completed });
    
    if (error) {
      // Revert on error
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
      addToast('Failed to update task', 'error');
    } else {
      addToast(completed ? 'Task reopened' : 'Task completed!', 'success');
    }
  };

  const handleDeleteTask = async (id: string) => {
    // Optimistic update
    const taskToDelete = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    
    const { error } = await api.deleteTask(id);
    
    if (error) {
      // Revert on error
      if (taskToDelete) {
        setTasks((prev) => [...prev, taskToDelete]);
      }
      addToast('Failed to delete task', 'error');
    } else {
      addToast('Task deleted', 'info');
    }
  };

  if (loading) return <SkeletonTaskList />;

  const upcomingTasks = tasks.filter((t) => !t.completed).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Upcoming Tasks</h3>
        {isConnected && (
          <span className="flex items-center text-xs text-green-600 dark:text-green-400">
            <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mr-1 animate-pulse"></span>
            Live
          </span>
        )}
      </div>
      {upcomingTasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">No tasks yet. Create one to get started!</p>
      ) : (
        upcomingTasks.map((task) => (
          <div key={task.id} className="flex items-start sm:items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id, task.completed)}
              className="w-5 h-5 min-w-[20px] text-blue-600 rounded mt-0.5 sm:mt-0 cursor-pointer"
              style={{ minWidth: '20px', minHeight: '20px' }}
            />
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm sm:text-base ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'dark:text-white'} break-words`}>
                {task.title}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                task.priority === 'high' 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
                  : task.priority === 'medium' 
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' 
                  : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              }`}>
                {task.priority}
              </span>
              <button 
                onClick={() => handleDeleteTask(task.id)} 
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Delete task"
              >
                ✕
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
