import React, { useEffect, useRef, useState, useCallback } from 'react';

const DynamicParticleSystem = ({ mousePos, theme = 'default' }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const themes = {
    default: { colors: ['#ff6b6b', '#ffd93d', '#4ecdc4'], count: 50 },
    fire: { colors: ['#ff4757', '#ff6348', '#ffa502'], count: 80 },
    ocean: { colors: ['#3742fa', '#2f3542', '#70a1ff'], count: 60 },
    forest: { colors: ['#2ed573', '#7bed9f', '#5f27cd'], count: 40 }
  };

  const currentTheme = themes[theme] || themes.default;

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = [];
    for (let i = 0; i < currentTheme.count; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 4 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: currentTheme.colors[Math.floor(Math.random() * currentTheme.colors.length)],
        life: Math.random() * 100 + 50,
        maxLife: Math.random() * 100 + 50,
        trail: []
      });
    }
  }, [currentTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setDimensions({ width: canvas.width, height: canvas.height });
    };

    updateDimensions();
    initParticles();
    window.addEventListener('resize', updateDimensions);

    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, i) => {
        // Mouse interaction
        if (mousePos) {
          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.vx += (dx / distance) * force * 0.1;
            particle.vy += (dy / distance) * force * 0.1;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary collision
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.8;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.8;

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Add to trail
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 10) particle.trail.shift();

        // Draw trail
        ctx.strokeStyle = particle.color + '40';
        ctx.lineWidth = 1;
        ctx.beginPath();
        particle.trail.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();

        // Draw particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius
        );
        gradient.addColorStop(0, particle.color + 'ff');
        gradient.addColorStop(1, particle.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connection lines
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${(100 - distance) / 100 * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });

        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.8
      }}
    />
  );
};

export default DynamicParticleSystem;