import React from 'react';

const EpicLoader = ({ message = 'Analyzing...', progress = 0 }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9998,
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Animated Logo */}
      <div style={{
        fontSize: '4rem',
        marginBottom: '2rem',
        animation: 'pulse 2s ease-in-out infinite',
        filter: 'drop-shadow(0 0 30px rgba(255, 107, 107, 0.8))'
      }}>
        🔍
      </div>

      {/* Loading Text */}
      <h2 style={{
        color: '#ffffff',
        fontSize: '2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #ff6b6b, #ffd93d, #4ecdc4)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'gradientMove 3s ease infinite',
        backgroundSize: '200% 200%'
      }}>
        {message}
      </h2>

      {/* Progress Bar */}
      <div style={{
        width: '300px',
        height: '6px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #ff6b6b, #ffd93d, #4ecdc4)',
          borderRadius: '3px',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 20px rgba(255, 107, 107, 0.6)',
          animation: 'shimmerBar 2s ease-in-out infinite'
        }} />
      </div>

      {/* Progress Percentage */}
      <div style={{
        color: '#ffffff',
        fontSize: '1.2rem',
        opacity: 0.8,
        fontFamily: 'monospace',
        marginBottom: '2rem'
      }}>
        {Math.floor(progress)}%
      </div>

      {/* Animated Dots */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
              animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
              boxShadow: '0 0 15px rgba(255, 107, 107, 0.6)'
            }}
          />
        ))}
      </div>

      {/* Fun Facts */}
      <div style={{
        maxWidth: '500px',
        textAlign: 'center',
        color: '#ffffff',
        opacity: 0.7,
        fontSize: '0.9rem',
        lineHeight: '1.6',
        animation: 'fadeInOut 4s ease-in-out infinite'
      }}>
        💡 Did you know? Our AI cross-references information with over 1,500 trusted sources worldwide!
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes gradientMove {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes shimmerBar {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default EpicLoader;
