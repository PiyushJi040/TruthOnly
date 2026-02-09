import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfettiEffect from './ConfettiEffect';
import './Landing.css';

const Result = () => {
  const [showContent, setShowContent] = useState(false);
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  const [particles, setParticles] = useState([]);
  const [celebrationParticles, setCelebrationParticles] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { result, input, inputType } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(false);
  const confidenceRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
    
    // Generate background particles
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
      setParticles(newParticles);
    };
    
    generateParticles();
    
    // Static particles - no continuous animation
    
    // Animate confidence bar - run once only
    if (result && result.confidence && animatedConfidence === 0) {
      setTimeout(() => {
        const duration = 2000;
        const increment = result.confidence / (duration / 50);
        let current = 0;
        const confidenceInterval = setInterval(() => {
          current += increment;
          if (current >= result.confidence) {
            current = result.confidence;
            clearInterval(confidenceInterval);
            
            // Create celebration particles if high confidence
            if (result.confidence > 80) {
              createCelebrationParticles();
              setShowConfetti(true);
            }
          }
          setAnimatedConfidence(Math.floor(current));
        }, 50);
      }, 1000);
    }

  }, [result]);
  
  const createCelebrationParticles = () => {
    const particles = [];
    for (let i = 0; i < 15; i++) {
      particles.push({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 10,
        y: 50 + (Math.random() - 0.5) * 10,
        size: Math.random() * 4 + 2,
        opacity: 0.8,
        color: `hsl(${Math.random() * 60 + (result?.isTrue ? 120 : 0)}, 70%, 60%)`,
      });
    }
    setCelebrationParticles(particles);
    
    // Static celebration particles - fade out after 3 seconds
    setTimeout(() => {
      setCelebrationParticles([]);
    }, 3000);
  };

  if (!result) {
    return (
      <div className="landing">
        <div className="background-video-container">
          <video autoPlay muted loop playsInline className="background-video">
            <source src="/mixkit-fire-background-with-flames-moving-to-the-centre-3757-full-hd.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="split-layout">
          <div className="left-panel">
            <div className="left-content visible">
              <div className="brand-section">
                <h1 className="main-title">
                  <span className="truth">Error</span>
                </h1>
                <p className="tagline">No result data available</p>
              </div>
            </div>
          </div>
          <div className="right-panel">
            <div className="right-content">
              <div className="content-section visible">
                <h2>Something went wrong</h2>
                <p>Please try checking your information again.</p>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    try {
                      navigate('/fact-check');
                    } catch (error) {
                      window.location.href = '/fact-check';
                    }
                  }} 
                  className="get-started-btn"
                >
                  Back to Fact Check
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { isTrue, confidence, sources } = result;

  return (
    <div className="landing">
      <ConfettiEffect trigger={showConfetti} duration={4000} />
      <div className="background-video-container">
        <video autoPlay muted loop playsInline className="background-video">
          <source src="/mixkit-fire-background-with-flames-moving-to-the-centre-3757-full-hd.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Background particles */}
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
            }}
          />
        ))}
      </div>
      
      {/* Celebration particles */}
      <div className="floating-particles">
        {celebrationParticles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              background: particle.color,
              zIndex: 10,
            }}
          />
        ))}
      </div>
      
      {showContent && (
        <div className="split-layout">
          <div className="left-panel">
            <div className="left-content visible">
              <div className="brand-section">
                <h1 className="main-title">
                  <span className={isTrue ? 'truth' : 'only'}>{isTrue ? 'Verified' : 'Disputed'}</span>
                </h1>
                <p className="tagline">Fact-checking complete</p>
              </div>
              
              <div className="stats-grid">
                <div className="stat-card" style={{ 
                  animation: 'bounceIn 0.8s ease-out 0.2s both',
                  borderColor: isTrue ? '#4ecdc4' : '#ff6b6b'
                }}>
                  <div className="stat-icon" style={{
                    fontSize: '2.5rem',
                    animation: 'rotateIn 1s ease-out 0.5s both'
                  }}>{isTrue ? '✅' : '❌'}</div>
                  <div className="stat-label">{isTrue ? 'Likely True' : 'Likely False'}</div>
                </div>
                <div className="stat-card" style={{ animation: 'bounceIn 0.8s ease-out 0.4s both' }}>
                  <div className="stat-number gradient-text" ref={confidenceRef}>
                    {animatedConfidence}%
                  </div>
                  <div className="stat-label">Confidence</div>
                </div>
                <div className="stat-card" style={{ animation: 'bounceIn 0.8s ease-out 0.6s both' }}>
                  <div className="stat-icon">📊</div>
                  <div className="stat-label">{inputType.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="right-panel">
            <div className="right-content">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    try {
                      navigate('/');
                    } catch (error) {
                      window.location.href = '/';
                    }
                  }}
                  className="back-btn"
                >
                  ← Back to Home
                </button>
              </div>
              
              <div className="content-section visible">
                <h2>Analysis Results</h2>
                <p>Our AI has analyzed your content and cross-referenced it with trusted sources.</p>
              </div>

              <div className="result-details">
                <div className="input-summary-card">
                  <h3>Input Summary</h3>
                  <div className="input-info">
                    <span className="input-type">{inputType.toUpperCase()}</span>
                    <p className="input-content">{typeof input === 'string' ? input : 'File uploaded'}</p>
                  </div>
                </div>

                <div className={`verdict-card ${isTrue ? 'true' : 'false'}`} style={{
                  animation: 'slideInFromRight 0.8s ease-out 0.4s both',
                  boxShadow: `0 20px 40px ${isTrue ? 'rgba(78, 205, 196, 0.2)' : 'rgba(255, 107, 107, 0.2)'}`
                }}>
                  <div className="verdict-header">
                    <div className="verdict-icon" style={{
                      animation: 'rotateIn 1s ease-out 0.8s both',
                      filter: `drop-shadow(0 0 15px ${isTrue ? '#4ecdc4' : '#ff6b6b'})`
                    }}>{isTrue ? '✅' : '❌'}</div>
                    <h3>{isTrue ? 'Information Verified' : 'Information Disputed'}</h3>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-label">Confidence Level</div>
                    <div className="confidence-progress">
                      <div 
                        className="confidence-fill" 
                        style={{
                          width: `${animatedConfidence}%`,
                          background: `linear-gradient(90deg, ${isTrue ? '#4ecdc4' : '#ff6b6b'}, ${isTrue ? '#4ecdc4' : '#ff6b6b'})`
                        }}
                      ></div>
                    </div>
                    <div className="confidence-text">{animatedConfidence}%</div>
                  </div>
                </div>

                <div className="sources-card" style={{
                  animation: 'slideInFromLeft 0.8s ease-out 0.6s both'
                }}>
                  <h3>Verified Sources</h3>
                  <div className="sources-list">
                    {sources.map((source, index) => (
                      <div 
                        key={index} 
                        className="source-item"
                        style={{
                          animation: `fadeIn 0.5s ease-out ${0.8 + index * 0.1}s both`,
                          transform: 'translateX(0)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateX(15px) scale(1.02)';
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateX(0) scale(1)';
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                        }}
                      >
                        <div className="source-icon">🔗</div>
                        {typeof source === 'object' ? (
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="source-link"
                            style={{
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {source.name}
                          </a>
                        ) : (
                          <span>{source}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="result-actions" style={{
                animation: 'slideInFromBottom 0.8s ease-out 0.8s both'
              }}>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    try {
                      navigate('/fact-check');
                    } catch (error) {
                      window.location.href = '/fact-check';
                    }
                  }} 
                  className="get-started-btn"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 107, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 107, 107, 0.3)';
                  }}
                >
                  🔄 Check Another
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    try {
                      navigate('/');
                    } catch (error) {
                      window.location.href = '/';
                    }
                  }} 
                  className="secondary-btn"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  🏠 Back to Home
                </button>
              </div>
              
              {/* Share results section */}
              <div className="share-section" style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                animation: 'fadeIn 1s ease-out 1s both',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 1rem', color: '#ff6b6b' }}>📤 Share Results</h4>
                <p style={{ margin: '0 0 1rem', opacity: 0.8, fontSize: '0.9rem' }}>
                  Help others by sharing this fact-check result
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    className="share-btn"
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(29, 161, 242, 0.2)',
                      border: '1px solid rgba(29, 161, 242, 0.5)',
                      borderRadius: '8px',
                      color: '#1da1f2',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(29, 161, 242, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(29, 161, 242, 0.2)';
                    }}
                  >
                    🐦 Twitter
                  </button>
                  <button 
                    className="share-btn"
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(66, 103, 178, 0.2)',
                      border: '1px solid rgba(66, 103, 178, 0.5)',
                      borderRadius: '8px',
                      color: '#4267b2',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(66, 103, 178, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(66, 103, 178, 0.2)';
                    }}
                  >
                    📘 Facebook
                  </button>
                  <button 
                    className="share-btn"
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onClick={(e) => {
                      navigator.clipboard.writeText(window.location.href);
                      e.currentTarget.textContent = '✅ Copied!';
                      setTimeout(() => {
                        e.currentTarget.textContent = '🔗 Copy Link';
                      }, 2000);
                    }}
                  >
                    🔗 Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
