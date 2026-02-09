import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success': return { bg: 'rgba(46, 204, 113, 0.9)', border: '#2ecc71' };
      case 'error': return { bg: 'rgba(231, 76, 60, 0.9)', border: '#e74c3c' };
      case 'warning': return { bg: 'rgba(243, 156, 18, 0.9)', border: '#f39c12' };
      case 'info': return { bg: 'rgba(52, 152, 219, 0.9)', border: '#3498db' };
      default: return { bg: 'rgba(52, 152, 219, 0.9)', border: '#3498db' };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '400px'
    }}>
      {notifications.map((notification, index) => {
        const colors = getColors(notification.type);
        return (
          <div
            key={notification.id}
            style={{
              background: colors.bg,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${colors.border}`,
              borderRadius: '15px',
              padding: '1rem 1.5rem',
              color: '#ffffff',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              transform: 'translateX(0)',
              animation: `slideInRight 0.3s ease-out ${index * 0.1}s both`,
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onClick={() => removeNotification(notification.id)}
          >
            {/* Progress bar for timed notifications */}
            {notification.duration > 0 && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                background: colors.border,
                animation: `progressBar ${notification.duration}ms linear`,
                transformOrigin: 'left'
              }} />
            )}

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{
                fontSize: '1.5rem',
                flexShrink: 0,
                animation: 'bounce 2s ease-in-out infinite'
              }}>
                {getIcon(notification.type)}
              </div>

              <div style={{ flex: 1 }}>
                {notification.title && (
                  <div style={{
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    fontSize: '1rem'
                  }}>
                    {notification.title}
                  </div>
                )}
                
                <div style={{
                  fontSize: '0.9rem',
                  opacity: 0.9,
                  lineHeight: '1.4'
                }}>
                  {notification.message}
                </div>

                {notification.action && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      notification.action.onClick();
                      removeNotification(notification.id);
                    }}
                    style={{
                      marginTop: '0.8rem',
                      padding: '0.5rem 1rem',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              >
                ×
              </button>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes slideInRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progressBar {
          0% {
            transform: scaleX(1);
          }
          100% {
            transform: scaleX(0);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
          60% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
};

// Hook for easy notification usage
export const useNotify = () => {
  const { addNotification } = useNotifications();

  return {
    success: (message, options = {}) => addNotification({ type: 'success', message, ...options }),
    error: (message, options = {}) => addNotification({ type: 'error', message, ...options }),
    warning: (message, options = {}) => addNotification({ type: 'warning', message, ...options }),
    info: (message, options = {}) => addNotification({ type: 'info', message, ...options }),
    custom: (notification) => addNotification(notification)
  };
};