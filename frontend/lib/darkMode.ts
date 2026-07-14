export const DARK_MODE_KEY = 'darkMode';

export const getDarkModePreference = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const stored = localStorage.getItem(DARK_MODE_KEY);
  if (stored !== null) {
    return stored === 'true';
  }
  
  // Default to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const setDarkModePreference = (isDark: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DARK_MODE_KEY, isDark.toString());
};

export const applyDarkMode = (isDark: boolean): void => {
  if (typeof document === 'undefined') return;
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
