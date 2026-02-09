import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  dark: {
    name: 'Dark',
    colors: {
      primary: '#ff6b6b',
      secondary: '#ffd93d',
      accent: '#4ecdc4',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      surface: 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      textSecondary: '#e0e0e0'
    },
    particles: {
      colors: ['#ff6b6b', '#ffd93d', '#4ecdc4'],
      count: 50
    }
  },
  light: {
    name: 'Light',
    colors: {
      primary: '#e74c3c',
      secondary: '#f39c12',
      accent: '#2ecc71',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
      surface: 'rgba(0, 0, 0, 0.05)',
      text: '#2c3e50',
      textSecondary: '#34495e'
    },
    particles: {
      colors: ['#e74c3c', '#f39c12', '#2ecc71'],
      count: 30
    }
  },
  neon: {
    name: 'Neon',
    colors: {
      primary: '#ff0080',
      secondary: '#00ff80',
      accent: '#8000ff',
      background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #330066 100%)',
      surface: 'rgba(255, 0, 128, 0.1)',
      text: '#ffffff',
      textSecondary: '#ff80c0'
    },
    particles: {
      colors: ['#ff0080', '#00ff80', '#8000ff'],
      count: 80
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      primary: '#3498db',
      secondary: '#2ecc71',
      accent: '#1abc9c',
      background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)',
      surface: 'rgba(52, 152, 219, 0.1)',
      text: '#ffffff',
      textSecondary: '#bde4ff'
    },
    particles: {
      colors: ['#3498db', '#2ecc71', '#1abc9c'],
      count: 40
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('truthonly-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (themeName) => {
    if (themes[themeName] && themeName !== currentTheme) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentTheme(themeName);
        localStorage.setItem('truthonly-theme', themeName);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 150);
    }
  };

  const theme = themes[currentTheme];

  // Apply theme to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [theme]);

  const value = {
    currentTheme,
    theme,
    themes: Object.keys(themes),
    changeTheme,
    isTransitioning
  };

  return (
    <ThemeContext.Provider value={value}>
      <div style={{
        transition: 'all 0.3s ease-in-out',
        opacity: isTransitioning ? 0.7 : 1
      }}>
        {children}
      </div>
      
      {isTransitioning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 107, 107, 0.1))',
            borderRadius: '15px',
            color: '#ffffff',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            Switching to {themes[currentTheme].name} theme...
          </div>
        </div>
      )}
    </ThemeContext.Provider>
  );
};

export const ThemeToggle = () => {
  const { currentTheme, themes: themeNames, changeTheme, theme } = useTheme();

  return (
    <div style={{
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      zIndex: 1000,
      display: 'flex',
      gap: '0.5rem',
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '0.5rem',
      borderRadius: '25px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {themeNames.map((themeName) => (
        <button
          key={themeName}
          onClick={() => changeTheme(themeName)}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '20px',
            background: currentTheme === themeName 
              ? 'linear-gradient(135deg, #ff6b6b, #ffd93d)' 
              : 'transparent',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            opacity: currentTheme === themeName ? 1 : 0.7
          }}
          onMouseEnter={(e) => {
            if (currentTheme !== themeName) {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.opacity = '1';
            }
          }}
          onMouseLeave={(e) => {
            if (currentTheme !== themeName) {
              e.target.style.background = 'transparent';
              e.target.style.opacity = '0.7';
            }
          }}
        >
          {themes[themeName].name}
        </button>
      ))}
    </div>
  );
};