import React, { useEffect, useState } from 'react';

const ConfettiEffect = ({ trigger, duration = 3000 }) => {
  const [confetti, setConfetti] = useState([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      generateConfetti();
      
      const timer = setTimeout(() => {
        setConfetti([]);
        setIsActive(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const generateConfetti = () => {
    const pieces = [];
    const colors = ['#ff6b6b', '#ffd93d', '#4ecdc4', '#95e1d3', '#f38181'];
    
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        top: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        speedX: (Math.random() - 0.5) * 2,
        speedY: Math.random() * 3 + 2,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
    setConfetti(pieces);
  };

  if (!isActive) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {confetti.map((piece) => (
        <div
          key={piece.id}
          style={{
            position: 'absolute',
            left: `${piece.left}%`,
            top: `${piece.top}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confettiFall ${3 + Math.random() * 2}s linear forwards`,
            opacity: 0.9
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ConfettiEffect;
