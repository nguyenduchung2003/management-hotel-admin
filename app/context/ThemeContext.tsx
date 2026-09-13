import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import viVN from 'antd/locale/vi_VN';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_theme', isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <ConfigProvider
        locale={viVN}
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 8,
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            colorBgContainer: isDarkMode ? '#141a28' : '#ffffff',
            colorBgElevated: isDarkMode ? '#1f293d' : '#ffffff',
            colorBgLayout: isDarkMode ? '#0b0f19' : '#f8fafc',
            colorText: isDarkMode ? '#f8fafc' : '#0f172a',
            colorTextSecondary: isDarkMode ? '#94a3b8' : '#64748b',
            colorBorder: isDarkMode ? '#1e293b' : '#e2e8f0',
            colorBorderSecondary: isDarkMode ? '#334155' : '#f1f5f9',
          },
          components: {
            Card: {
              boxShadowTertiary: isDarkMode 
                ? '0 4px 20px -2px rgba(0,0,0,0.5)' 
                : '0 4px 20px -2px rgba(0,0,0,0.05)',
            },
            Table: {
              headerBg: isDarkMode ? '#1b2436' : '#f1f5f9',
              headerColor: isDarkMode ? '#f8fafc' : '#0f172a',
              rowHoverBg: isDarkMode ? '#1e293d' : '#f8fafc',
            },
            Menu: {
              darkItemBg: '#0f172a',
              darkSubMenuItemBg: '#0f172a',
            },
            Layout: {
              headerBg: isDarkMode ? '#141a28' : '#ffffff',
              siderBg: isDarkMode ? '#0f172a' : '#ffffff',
              bodyBg: isDarkMode ? '#0b0f19' : '#f4f6f9',
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
