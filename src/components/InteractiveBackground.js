import React, { useEffect, useRef, useState } from 'react';

const InteractiveBackground = ({ scrollY = 0, mousePos = { x: 0, y: 0 } }) => {
  const containerRef = useRef(null);
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const generateShapes = () => {
      const newShapes = [];
      for (let i = 0; i < 8; i++) {
        newShapes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 300 + 100,
          rotation: Math.random() * 360,
          speed: Math.random() * 0.5 + 0.1,
          direction: Math.random() * Math.PI * 2,
          color: `hsl(${Math.random() * 60 + 340}, 70%, 60%)`,
          opacity: Math.random() * 0.3 + 0.1,
          morphSpeed: Math.random() * 0.02 + 0.01
        });
      }
      setShapes(newShapes);
    };

    generateShapes();

    const animateShapes = () => {
      setShapes(prev => prev.map(shape => ({
        ...shape,
        x: (shape.x + Math.cos(shape.direction) * shape.speed) % 100,
        y: (shape.y + Math.sin(shape.direction) * shape.speed) % 100,
        rotation: (shape.rotation + shape.speed * 20) % 360,
        direction: shape.direction + shape.morphSpeed
      })));
    };

    const interval = setInterval(animateShapes, 50);
    return () => clearInterval(interval);
  }, []);

  const parallaxOffset = scrollY * 0.3;
  const mouseInfluence = {
    x: (mousePos.x / window.innerWidth - 0.5) * 20,
    y: (mousePos.y / window.innerHeight - 0.5) * 20
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        transform: `translateY(${parallaxOffset}px) translateX(${mouseInfluence.x}px) translateY(${mouseInfluence.y}px)`
      }}
    >
      {/* Animated gradient background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at ${20 + mouseInfluence.x}% ${80 + mouseInfluence.y}%, rgba(255, 107, 107, 0.15) 0%, transparent 50%),
          radial-gradient(circle at ${80 - mouseInfluence.x}% ${20 - mouseInfluence.y}%, rgba(76, 201, 240, 0.15) 0%, transparent 50%),
          radial-gradient(circle at ${50 + mouseInfluence.x * 0.5}% ${50 + mouseInfluence.y * 0.5}%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
        `,
        animation: 'gradientShift 10s ease-in-out infinite'
      }} />

      {/* Morphing shapes */}
      {shapes.map((shape, index) => (
        <div
          key={shape.id}
          style={{
            position: 'absolute',
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            background: `linear-gradient(${shape.rotation}deg, ${shape.color}40, transparent)`,
            borderRadius: `${50 + Math.sin(Date.now() * 0.001 + index) * 30}%`,
            filter: 'blur(60px)',
            transform: `
              rotate(${shape.rotation}deg) 
              scale(${1 + Math.sin(Date.now() * 0.002 + index) * 0.3})
              translate(${mouseInfluence.x * (index + 1) * 0.1}px, ${mouseInfluence.y * (index + 1) * 0.1}px)
            `,
            opacity: shape.opacity,
            transition: 'all 0.3s ease-out'
          }}
        />
      ))}

      {/* Floating geometric shapes */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`geo-${i}`}
          style={{
            position: 'absolute',
            left: `${(i * 8.33) % 100}%`,
            top: `${(i * 13.7) % 100}%`,
            width: '2px',
            height: '2px',
            background: `hsl(${340 + i * 10}, 70%, 60%)`,
            borderRadius: '50%',
            transform: `
              translate(${Math.sin(Date.now() * 0.001 + i) * 50}px, ${Math.cos(Date.now() * 0.001 + i) * 30}px)
              scale(${1 + Math.sin(Date.now() * 0.002 + i) * 0.5})
            `,
            opacity: 0.6,
            boxShadow: `0 0 10px hsl(${340 + i * 10}, 70%, 60%)`
          }}
        />
      ))}

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { 
            filter: hue-rotate(0deg) brightness(1); 
          }
          25% { 
            filter: hue-rotate(90deg) brightness(1.2); 
          }
          50% { 
            filter: hue-rotate(180deg) brightness(0.8); 
          }
          75% { 
            filter: hue-rotate(270deg) brightness(1.1); 
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveBackground;