export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const getStoredAuth = (): { user: User | null; token: string | null } => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  return {
    token,
    user: user ? JSON.parse(user) : null,
  };
};

export const setStoredAuth = (user: User, token: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
