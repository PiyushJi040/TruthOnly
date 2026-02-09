import React, { useEffect, useState } from 'react';

const EasterEgg = () => {
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [activated, setActivated] = useState(false);
  const [clicks, setClicks] = useState(0);
  
  // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      
      if (key === konamiCode[konamiProgress].toLowerCase()) {
        setKonamiProgress(prev => prev + 1);
        
        if (konamiProgress === konamiCode.length - 1) {
          activateEasterEgg();
          setKonamiProgress(0);
        }
      } else {
        setKonamiProgress(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiProgress]);

  const activateEasterEgg = () => {
    setActivated(true);
    
    // Create rainbow effect
    document.body.style.animation = 'rainbowBackground 3s ease-in-out';
    
    setTimeout(() => {
      setActivated(false);
      document.body.style.animation = '';
    }, 3000);
  };

  const handleLogoClick = () => {
    setClicks(prev => prev + 1);
    
    if (clicks >= 9) {
      activateEasterEgg();
      setClicks(0);
    }
  };

  return (
    <>
      {activated && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          fontSize: '4rem',
          animation: 'bounce 1s ease-in-out infinite',
          pointerEvents: 'none',
          textShadow: '0 0 20px rgba(255, 107, 107, 0.8)'
        }}>
          🎉 You found the secret! 🎉
        </div>
      )}
      
      <style jsx>{`
        @keyframes rainbowBackground {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
    </>
  );
};

export default EasterEgg;
