import React, { useState, useEffect, useRef } from 'react';

const AnimatedStats = ({ stats, className = '' }) => {
  const [animatedValues, setAnimatedValues] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const duration = 2000 + index * 200;
      const startTime = Date.now();
      const startValue = 0;
      const endValue = stat.value;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

        setAnimatedValues(prev => ({
          ...prev,
          [stat.key]: currentValue
        }));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      setTimeout(() => animate(), index * 100);
    });
  };

  const formatValue = (value, format) => {
    if (!value) return '0';
    
    switch (format) {
      case 'percentage':
        return `${value}%`;
      case 'thousands':
        return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString();
      case 'millions':
        return value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : 
               value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString();
      case 'currency':
        return `$${value.toLocaleString()}`;
      default:
        return value.toLocaleString();
    }
  };

  return (
    <div ref={containerRef} className={`animated-stats ${className}`}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        padding: '2rem 0'
      }}>
        {stats.map((stat, index) => (
          <div
            key={stat.key}
            style={{
              textAlign: 'center',
              padding: '2rem 1.5rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 107, 107, 0.1))',
              borderRadius: '20px',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
              opacity: isVisible ? 1 : 0,
              transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 107, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Animated background effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              animation: isVisible ? 'shimmer 2s ease-in-out infinite' : 'none',
              animationDelay: `${index * 0.2}s`
            }} />

            {/* Icon */}
            {stat.icon && (
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                filter: 'drop-shadow(0 0 10px rgba(255, 107, 107, 0.5))',
                animation: isVisible ? 'bounce 2s ease-in-out infinite' : 'none',
                animationDelay: `${index * 0.3}s`
              }}>
                {stat.icon}
              </div>
            )}

            {/* Animated number */}
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ff6b6b, #ffd93d, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem',
              fontFamily: 'monospace',
              letterSpacing: '2px'
            }}>
              {formatValue(animatedValues[stat.key] || 0, stat.format)}
              {stat.suffix && <span style={{ color: '#ff6b6b' }}>{stat.suffix}</span>}
            </div>

            {/* Label */}
            <div style={{
              fontSize: '1rem',
              color: '#ffffff',
              opacity: 0.9,
              fontWeight: '300',
              letterSpacing: '0.5px'
            }}>
              {stat.label}
            </div>

            {/* Progress bar for percentage stats */}
            {stat.format === 'percentage' && (
              <div style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '2px',
                marginTop: '1rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(animatedValues[stat.key] || 0)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease',
                  boxShadow: '0 0 10px rgba(255, 107, 107, 0.5)'
                }} />
              </div>
            )}

            {/* Trend indicator */}
            {stat.trend && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: '1.2rem',
                color: stat.trend === 'up' ? '#4ecdc4' : stat.trend === 'down' ? '#ff6b6b' : '#ffd93d'
              }}>
                {stat.trend === 'up' ? '📈' : stat.trend === 'down' ? '📉' : '➡️'}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedStats;