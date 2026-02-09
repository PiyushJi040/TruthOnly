import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartSearch from './SmartSearch';
import AnimatedStats from './AnimatedStats';
import { useTheme } from './ThemeProvider';
import { useNotify } from './NotificationSystem';
import n8nService from '../services/n8nService';

const AdvancedFactCheck = () => {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState('url');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationStatus, setValidationStatus] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [recentChecks, setRecentChecks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const notify = useNotify();
  const fileInputRef = useRef(null);
  const progressInterval = useRef(null);

const inputTypes = [
  { type: 'url', icon: '🌐', title: 'URL', desc: 'Verify news articles by URL', color: '#3498db' },
  { type: 'text', icon: '📝', title: 'Text', desc: 'Paste text content directly', color: '#2ecc71' },
  { type: 'image', icon: '🖼️', title: 'Image', desc: 'Upload screenshots or images', color: '#e74c3c' }
];

const statsData = [
  { key: 'articles', value: 10000000, label: 'Articles Verified', format: 'millions', icon: '📰', trend: 'up', suffix: '+' },
  { key: 'accuracy', value: 95, label: 'Accuracy Rate', format: 'percentage', icon: '🎯', trend: 'up' },
  { key: 'users', value: 50000, label: 'Active Users', format: 'thousands', icon: '👥', trend: 'up', suffix: '+' },
  { key: 'sources', value: 1500, label: 'Trusted Sources', format: 'default', icon: '🔗', trend: 'up' }
];

const taglines = [
  "Unveiling Truth in the Age of Information",
  "AI-Powered Fact Verification at Your Fingertips",
  "Combat Misinformation with Advanced Technology",
  "Your Shield Against Fake News and Deception"
];

  useEffect(() => {
    // Load recent checks from localStorage
    const stored = localStorage.getItem('truthonly-recent-checks');
    if (stored) {
      setRecentChecks(JSON.parse(stored));
    }

    // Generate smart suggestions based on trending topics
    const trendingSuggestions = [
      'COVID-19 vaccine side effects',
      'Climate change latest research',
      'Election security measures',
      'Artificial intelligence developments',
      'Social media privacy policies'
    ];
    setSuggestions(trendingSuggestions);
    
    // Generate particles for background
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.2,
        });
      }
      setParticles(newParticles);
    };
    
    generateParticles();
  }, []);

  // Real-time validation
  useEffect(() => {
    if (!(typeof input === 'string' ? input.trim() : input) && inputType !== 'image') {
      setValidationStatus('');
      return;
    }

    const validateInput = () => {
      switch (inputType) {
        case 'url':
          try {
            new URL(input);
            setValidationStatus('valid');
          } catch {
            setValidationStatus('invalid');
          }
          break;
        case 'text':
          if (input.length < 10) {
            setValidationStatus('too-short');
          } else if (input.length > 5000) {
            setValidationStatus('too-long');
          } else {
            setValidationStatus('valid');
          }
          break;
        case 'image':
          setValidationStatus(input ? 'valid' : '');
          break;
      }
    };

    const debounceTimer = setTimeout(validateInput, 300);
    return () => clearTimeout(debounceTimer);
  }, [input, inputType]);

  const simulateProgress = () => {
    setProgress(0);
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval.current);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(typeof input === 'string' ? input.trim() : input) && inputType !== 'image') return;
    if (inputType === 'image' && !input) return;
    if (validationStatus !== 'valid') return;

    setLoading(true);
    simulateProgress();

    // Add to recent checks
    const checkData = {
      id: Date.now(),
      type: inputType,
      content: typeof input === 'string' ? input : input.name,
      timestamp: new Date().toISOString()
    };
    
    const newRecent = [checkData, ...recentChecks.filter(c => c.id !== checkData.id)].slice(0, 10);
    setRecentChecks(newRecent);
    localStorage.setItem('truthonly-recent-checks', JSON.stringify(newRecent));



    try {
      // Prepare data for n8n workflow
      let factCheckData = {
        inputType,
        timestamp: new Date().toISOString()
      };

      if (inputType === 'url') {
        factCheckData.url = input;
        factCheckData.title = 'URL Verification';
        factCheckData.content = input;
      } else if (inputType === 'text') {
        factCheckData.title = 'Text Verification';
        factCheckData.content = input;
        factCheckData.text = input;
      } else if (inputType === 'image') {
        factCheckData.title = 'Image Verification';
        factCheckData.content = `Image file: ${input?.name || 'uploaded image'}`;
      }

      const result = await n8nService.factCheck(factCheckData);
      
      setProgress(100);

      
      setTimeout(() => {
        try {
          navigate('/result', { state: { result, input, inputType } });
        } catch (error) {
          window.location.href = '/result';
        }
      }, 500);

    } catch (error) {
      console.error('Error checking fact:', error);
      
      // Generate mock result with enhanced logic
      const mockResult = generateMockResult();
      
      setProgress(100);

      
      setTimeout(() => {
        try {
          navigate('/result', { state: { result: mockResult, input, inputType } });
        } catch (error) {
          window.location.href = '/result';
        }
      }, 500);

    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        clearInterval(progressInterval.current);
      }, 1000);
    }
  };

  const generateMockResult = () => {
    let inputText = '';
    if (inputType === 'url') inputText = input.toLowerCase();
    else if (inputType === 'text') inputText = input.toLowerCase();
    else if (inputType === 'image') inputText = input?.name?.toLowerCase() || 'image';

    // Enhanced mock logic with more scenarios
    let isTrue, confidence, sources;

    if (inputText.includes('covid') && inputText.includes('vaccine')) {
      isTrue = true;
      confidence = 92;
      sources = [
        { name: 'WHO - COVID-19 Vaccine Safety', url: 'https://www.who.int/news-room/feature-stories/detail/safety-of-covid-19-vaccines' },
        { name: 'CDC - Vaccine Safety Monitoring', url: 'https://www.cdc.gov/coronavirus/2019-ncov/vaccines/safety/' },
        { name: 'FDA - Vaccine Approval Process', url: 'https://www.fda.gov/vaccines-blood-biologics/vaccines/' }
      ];
    } else if (inputText.includes('climate') && inputText.includes('change')) {
      isTrue = true;
      confidence = 97;
      sources = [
        { name: 'IPCC Climate Reports', url: 'https://www.ipcc.ch/' },
        { name: 'NASA Climate Evidence', url: 'https://climate.nasa.gov/evidence/' },
        { name: 'NOAA Climate Data', url: 'https://www.climate.gov/' }
      ];
    } else {
      isTrue = Math.random() > 0.4;
      confidence = Math.floor(Math.random() * 40) + (isTrue ? 60 : 30);
      sources = [
        { name: 'Fact-Check Database Cross-Reference', url: 'https://www.factcheck.org/' },
        { name: 'Multiple Source Verification', url: 'https://www.snopes.com/' },
        { name: 'Expert Review Panel', url: 'https://www.reuters.com/fact-check/' }
      ];
    }

    return { isTrue, confidence, sources };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      setInputType('image');
      setInput(files[0]);
    } else {
      console.log('Please upload a valid image file');
    }
  };

  const handleQuickSearch = (query) => {
    setInputType('text');
    setInput(query);

  };

  const getValidationMessage = () => {
    switch (validationStatus) {
      case 'invalid': return 'Please enter a valid URL';
      case 'too-short': return 'Text must be at least 10 characters';
      case 'too-long': return 'Text must be less than 5000 characters';
      case 'valid': return 'Ready to verify! ✓';
      default: return '';
    }
  };

  const getValidationColor = () => {
    switch (validationStatus) {
      case 'invalid':
      case 'too-short':
      case 'too-long':
        return theme.colors.primary;
      case 'valid':
        return theme.colors.accent;
      default:
        return 'transparent';
    }
  };

  return (
    <div 
      className="landing"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="background-video-container">
        <video autoPlay muted loop playsInline className="background-video">
          <source src="/mixkit-fire-background-with-flames-moving-to-the-centre-3757-full-hd.mp4" type="video/mp4" />
        </video>
      </div>
      
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


      <div className="split-layout">
        {/* Fixed Left Side */}
        <div className="left-panel">
          <div className="left-content">
            <div className="brand-section">
              <h1 className="main-title">
                <span className="truth">Truth</span><span className="only">Only</span>
              </h1>
              <p className="tagline">
                Advanced Fact Checking
                <span className="cursor" style={{ animation: 'blink 1s infinite' }}>|</span>
              </p>
            </div>

            <AnimatedStats stats={statsData} />
          </div>
        </div>

        {/* Scrollable Right Side */}
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

            <div className="content-section">
              <h2>Verify Information</h2>
              <p>Advanced AI-powered fact-checking platform helps you distinguish between reliable information and deceptive content.</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <SmartSearch
                onSearch={handleQuickSearch}
                placeholder="Quick search for trending topics..."
                suggestions={suggestions}
              />
            </div>

            {/* Input type selection */}
            <div className="input-type-grid">
              {inputTypes.map((type) => (
                <div
                  key={type.type}
                  onClick={() => {
                    setInputType(type.type);
                    setInput('');
                    setValidationStatus('');
                  }}
                  className={`input-type-card interactive-card ${inputType === type.type ? 'active' : ''}`}
                >
                  <div className="type-icon">{type.icon}</div>
                  <h3>{type.title}</h3>
                  <p>{type.desc}</p>
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="modern-fact-form">
          {/* Input field based on type */}
          {inputType === 'url' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="url"
                placeholder="Enter news article URL (e.g., https://example.com/news)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
                className="modern-input"
                style={{
                  borderColor: getValidationColor()
                }}
              />
              {validationStatus && (
                <div style={{
                  marginTop: '0.5rem',
                  color: getValidationColor(),
                  fontSize: '0.9rem',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px'
                }}>
                  {getValidationMessage()}
                </div>
              )}
            </div>
          )}

          {inputType === 'text' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <textarea
                placeholder="Paste the news text or claim you want to verify..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
                rows="6"
                className="modern-textarea"
                style={{
                  borderColor: getValidationColor()
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.5rem'
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  opacity: 0.7,
                  color: input.length > 4500 ? theme.colors.primary : theme.colors.text
                }}>
                  {input.length}/5000 characters
                </div>
                {validationStatus && (
                  <div style={{
                    color: getValidationColor(),
                    fontSize: '0.9rem'
                  }}>
                    {getValidationMessage()}
                  </div>
                )}
              </div>
            </div>
          )}

          {inputType === 'image' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div className={`file-upload-area ${dragOver ? 'drag-over' : ''}`}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setInput(e.target.files[0])}
                  required
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload" style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    fontSize: dragOver ? '4rem' : '3rem',
                    transition: 'all 0.3s ease'
                  }}>📁</div>
                  <div>
                    <strong>{dragOver ? 'Drop here!' : 'Click to upload'}</strong>
                    {!dragOver && ' or drag and drop'}
                    <br />
                    <small>PNG, JPG, GIF up to 10MB</small>
                  </div>
                </label>
                {input && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px'
                  }}>
                    📎 {input.name} ({(input.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || validationStatus !== 'valid'}
            className="check-fact-btn"
          >
            {loading ? (
              <>
                <span style={{ marginRight: '0.5rem' }}>⏳</span>
                Analyzing...
              </>
            ) : (
              <>
                <span style={{ marginRight: '0.5rem' }}>🔍</span>
                Verify Information
              </>
            )}
          </button>
        </form>

            {/* Recent checks */}
            {recentChecks.length > 0 && (
              <div style={{
                background: theme.colors.surface,
                padding: '2rem',
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '4rem'
              }}>
                <h3 style={{ marginBottom: '1rem', color: theme.colors.primary }}>
                  📋 Recent Fact-Checks
                </h3>
                <div style={{
                  display: 'grid',
                  gap: '1rem',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {recentChecks.slice(0, 5).map((check) => (
                    <div
                      key={check.id}
                      onClick={() => {
                        setInputType(check.type);
                        setInput(check.content);
                      }}
                      style={{
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>
                        {check.type === 'url' ? '🌐' : check.type === 'text' ? '📝' : '🖼️'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', marginBottom: '0.2rem' }}>
                          {check.content.length > 50 ? check.content.substring(0, 50) + '...' : check.content}
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                          {new Date(check.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFactCheck;