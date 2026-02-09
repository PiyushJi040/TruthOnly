import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedStats from './AnimatedStats';
import SmartSearch from './SmartSearch';
import EasterEgg from './EasterEgg';
import { useTheme } from './ThemeProvider';
import { useNotify } from './NotificationSystem';
import { createRipple, soundEffects, createParticleBurst } from '../utils/interactions';
import './Landing.css';

// Fixed: Removed all contentStep references and loading overlays

const taglines = [
  "Unveiling Truth in the Age of Information",
  "AI-Powered Fact Verification at Your Fingertips",
  "Combat Misinformation with Advanced Technology",
  "Your Shield Against Fake News and Deception"
];

const Landing = () => {
  const [typedText, setTypedText] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [particles, setParticles] = useState([]);
  const [geometricShapes, setGeometricShapes] = useState([]);
  const [featureCardsVisible, setFeatureCardsVisible] = useState([]);
  const featureRefs = useRef([]);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const notify = useNotify();
  const containerRef = useRef(null);
  
  const statsData = [
    { key: 'articles', value: 10000000, label: 'Articles Verified', format: 'millions', icon: '📰', trend: 'up', suffix: '+' },
    { key: 'accuracy', value: 95, label: 'Accuracy Rate', format: 'percentage', icon: '🎯', trend: 'up' },
    { key: 'users', value: 50000, label: 'Active Users', format: 'thousands', icon: '👥', trend: 'up', suffix: '+' },
    { key: 'sources', value: 1500, label: 'Trusted Sources', format: 'default', icon: '🔗', trend: 'up' }
  ];

  useEffect(() => {
    // Generate floating particles with random movements
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 2,
          opacity: Math.random() * 0.6 + 0.2,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          delay: Math.random() * 5
        });
      }
      setParticles(newParticles);
    };
    
    // Generate floating geometric shapes
    const generateShapes = () => {
      const shapes = [];
      const types = ['circle', 'square', 'triangle', 'hexagon'];
      for (let i = 0; i < 15; i++) {
        shapes.push({
          id: i,
          type: types[Math.floor(Math.random() * types.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 80 + 40,
          opacity: Math.random() * 0.15 + 0.05,
          rotation: Math.random() * 360,
          duration: Math.random() * 20 + 15
        });
      }
      setGeometricShapes(shapes);
    };
    
    generateParticles();
    generateShapes();
    
    // Enhanced typing effect
    let currentTaglineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typeText = () => {
      const currentTagline = taglines[currentTaglineIndex];
      
      if (!isDeleting) {
        setTypedText(currentTagline.slice(0, charIndex + 1));
        charIndex++;
        
        if (charIndex === currentTagline.length) {
          setTimeout(() => isDeleting = true, 2000);
        }
      } else {
        setTypedText(currentTagline.slice(0, charIndex - 1));
        charIndex--;
        
        if (charIndex === 0) {
          isDeleting = false;
          currentTaglineIndex = (currentTaglineIndex + 1) % taglines.length;
        }
      }
    };
    
    const typingInterval = setInterval(typeText, isDeleting ? 50 : 100);
    
    // Intersection Observer for feature cards
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = featureRefs.current.indexOf(entry.target);
            if (index !== -1 && !featureCardsVisible.includes(index)) {
              setFeatureCardsVisible(prev => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.2 }
    );
    
    featureRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    // Mouse tracking
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    // Scroll tracking
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setShowSearch(true);
            break;
          case '/':
            e.preventDefault();
            setShowSearch(true);
            break;
        }
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearInterval(typingInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [navigate, notify]);
  
  const handleSearch = (query) => {
    setShowSearch(false);
    navigate('/fact-check');
  };

  const handleGetStarted = () => {
    soundEffects.playClick();
    console.log('Navigating to fact-check page');
    try {
      navigate('/fact-check');
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/fact-check';
    }
  };
  
  const handleFeatureClick = (feature) => {
    soundEffects.playClick();
    console.log('Feature clicked, navigating to fact-check');
    try {
      navigate('/fact-check');
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/fact-check';
    }
  };

  return (
    <div ref={containerRef} className="landing" style={{ background: theme.colors.background }}>
      <EasterEgg />

      {/* Floating Particles with Random Movements */}
      <div className="floating-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animation: `floatRandom ${8 + particle.delay}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
              transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`
            }}
          />
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      <div className="floating-shapes">
        {geometricShapes.map((shape) => (
          <div
            key={shape.id}
            className={`geometric-shape ${shape.type}`}
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              opacity: shape.opacity,
              animation: `floatShape ${shape.duration}s ease-in-out infinite, rotateShape ${shape.duration * 1.5}s linear infinite`,
              transform: `rotate(${shape.rotation}deg) translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`,
            }}
          />
        ))}
      </div>

      {/* Global Search Overlay */}
      {showSearch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{ width: '90%', maxWidth: '600px' }}>
            <SmartSearch
              onSearch={handleSearch}
              placeholder="Search for fact-checks, topics, or enter content to verify..."
            />
            <div style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: '#ffffff',
              opacity: 0.7,
              fontSize: '0.9rem'
            }}>
              Press Escape to close • Ctrl+K to open search
            </div>
          </div>
        </div>
      )}

      <div className="split-layout">
        {/* Fixed Left Side */}
        <div className="left-panel">
          <div className="left-content">
            <div className="brand-section">
              <h1 className="main-title">
                <span className="truth">Truth</span><span className="only">Only</span>
              </h1>
              <p className="tagline">
                {typedText}
                <span className="cursor" style={{ animation: 'blink 1s infinite' }}>|</span>
              </p>
            </div>
            
            <AnimatedStats stats={statsData} />
          </div>
        </div>

        {/* Scrollable Right Side */}
        <div className="right-panel">
          <div className="right-content">
            <div className="content-section">
              <h2>Verify News. Combat Misinformation.</h2>
              <p>Our advanced AI-powered fact-checking platform helps you distinguish between reliable information and deceptive content.</p>
            </div>

            <div className="features-section">
              {[
                { icon: '🔍', title: 'Deep Analysis', desc: 'Comprehensive verification using multiple trusted sources' },
                { icon: '⚡', title: 'Instant Results', desc: 'Get fact-check results in seconds' },
                { icon: '🛡️', title: 'Privacy First', desc: 'Your data stays secure and private' },
                { icon: '🤝', title: 'Open and Honest', desc: 'Transparent methodology and reliable sources' },
                { icon: '📈', title: 'Self-development', desc: 'Continuous improvement of our AI models' },
                { icon: '🌐', title: 'Global Coverage', desc: 'Fact-checking in multiple languages worldwide' },
              ].map((feature, index) => (
                <div
                  key={index}
                  ref={el => featureRefs.current[index] = el}
                  className="feature-card"
                  onClick={() => handleFeatureClick(feature)}
                  style={{
                    cursor: 'pointer',
                    transform: featureCardsVisible.includes(index) ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
                    opacity: featureCardsVisible.includes(index) ? 1 : 0,
                    transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`,
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '15px',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02) rotateX(5deg)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 107, 0.3)';
                    e.currentTarget.style.background = `linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(78, 205, 196, 0.15))`;
                    e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`;
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div className="feature-glow" style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none'
                  }} />
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">{feature.icon}</div>
                  </div>
                  <div className="feature-content">
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="cta-section">
              <button 
                className="get-started-btn" 
                onClick={(e) => {
                  e.preventDefault();
                  createRipple(e);
                  createParticleBurst(e.clientX, e.clientY, '#ff6b6b', 15);
                  setTimeout(() => handleGetStarted(), 100);
                }}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  transform: 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 107, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 107, 107, 0.3)';
                }}
              >
                <span className="btn-icon">🚀</span>
                Start Fact-Checking Now
              </button>
              <p className="cta-subtitle">Free to use. No registration required.</p>
              <div style={{
                marginTop: '1rem',
                fontSize: '0.8rem',
                opacity: 0.7,
                color: theme.colors.textSecondary
              }}>
                💡 Tip: Press Ctrl+K to open quick search
              </div>
            </div>

            <div className="how-it-works">
              <h2>How It Works</h2>
              <div className="steps">
                {[
                  { num: 1, title: 'Input Content', desc: 'Paste a URL, text, or upload an image' },
                  { num: 2, title: 'AI Analysis', desc: 'Our AI cross-references with trusted sources' },
                  { num: 3, title: 'Get Results', desc: 'Receive detailed verification report' },
                ].map((step, index) => (
                  <div key={index} className="step">
                    <div className="step-number">{step.num}</div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
