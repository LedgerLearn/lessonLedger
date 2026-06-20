const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'An error occurred' };
    }

    const data = await response.json();
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const api = {
  // Auth
  signup: (email: string, name: string, password: string) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    }),

  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Roadmaps
  getRoadmaps: () => apiCall('/roadmaps'),
  getRoadmap: (id: string) => apiCall(`/roadmaps/${id}`),
  createRoadmap: (data: any) =>
    apiCall('/roadmaps', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Tasks
  getTasks: () => apiCall('/tasks'),
  createTask: (data: any) =>
    apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTask: (id: string, data: any) =>
    apiCall(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteTask: (id: string) =>
    apiCall(`/tasks/${id}`, {
      method: 'DELETE',
    }),

  // Streaks
  getStreak: () => apiCall('/streaks'),
  updateStreak: () =>
    apiCall('/streaks/update', {
      method: 'POST',
    }),

  // Achievements
  getAchievements: () => apiCall('/achievements'),
  createAchievement: (data: any) =>
    apiCall('/achievements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
