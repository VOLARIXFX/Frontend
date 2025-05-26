import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react';

const DarkMode = createContext();

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <DarkMode.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </DarkMode.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(DarkMode);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};
