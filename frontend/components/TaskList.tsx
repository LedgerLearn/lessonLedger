'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  priority: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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
    const { data } = await api.updateTask(id, { completed: !completed });
    if (data) {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
    }
  };

  const handleDeleteTask = async (id: string) => {
    await api.deleteTask(id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  if (loading) return <div className="text-center py-8">Loading tasks...</div>;

  const upcomingTasks = tasks.filter((t) => !t.completed).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold mb-4">Upcoming Tasks</h3>
      {upcomingTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No tasks yet. Create one to get started!</p>
      ) : (
        upcomingTasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id, task.completed)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <div className="flex-1">
              <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
              <p className="text-sm text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
              {task.priority}
            </span>
            <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  );
}
