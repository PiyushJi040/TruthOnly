import React, { useState, useEffect, useRef } from 'react';

const SmartSearch = ({ onSearch, placeholder = "Search...", suggestions = [] }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const defaultSuggestions = [
    'COVID-19 vaccine effectiveness',
    'Climate change facts',
    'Election fraud claims',
    'Social media misinformation',
    'Health supplement claims',
    'Celebrity death hoax',
    'Political fact check',
    'Scientific study verification'
  ];

  const allSuggestions = [...suggestions, ...defaultSuggestions];

  useEffect(() => {
    const stored = localStorage.getItem('truthonly-recent-searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = allSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions(recentSearches.slice(0, 5));
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [query, allSuggestions, recentSearches]);

  const handleSearch = (searchQuery) => {
    const finalQuery = String(searchQuery || query || '');
    if (finalQuery.trim()) {
      // Add to recent searches
      const newRecent = [finalQuery, ...recentSearches.filter(s => s !== finalQuery)].slice(0, 10);
      setRecentSearches(newRecent);
      localStorage.setItem('truthonly-recent-searches', JSON.stringify(newRecent));
      
      onSearch(finalQuery);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSearch(filteredSuggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('truthonly-recent-searches');
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 107, 107, 0.1))',
        borderRadius: '25px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        boxShadow: showSuggestions ? '0 10px 30px rgba(255, 107, 107, 0.3)' : '0 5px 15px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          padding: '0 1rem',
          fontSize: '1.2rem',
          color: '#ff6b6b'
        }}>
          🔍
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: '1rem 0',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setShowSuggestions(false);
              inputRef.current?.focus();
            }}
            style={{
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              opacity: 0.7,
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.7'}
          >
            ✕
          </button>
        )}

        <button
          onClick={() => handleSearch()}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
            border: 'none',
            borderRadius: '20px',
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: '600',
            margin: '0.2rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 5px 15px rgba(255, 107, 107, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 5px 15px rgba(255, 107, 107, 0.3)';
          }}
        >
          Search
        </button>
      </div>

      {(showSuggestions || query.length > 0) && (
        <div
          ref={suggestionsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(26, 26, 46, 0.9))',
            backdropFilter: 'blur(20px)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginTop: '0.5rem',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          {query.length === 0 && recentSearches.length > 0 && (
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#ffffff', fontSize: '0.9rem', opacity: 0.8 }}>
                Recent Searches
              </span>
              <button
                onClick={clearRecentSearches}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              >
                Clear
              </button>
            </div>
          )}

          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '1rem',
                cursor: 'pointer',
                color: '#ffffff',
                borderBottom: index < filteredSuggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                background: selectedIndex === index ? 'rgba(255, 107, 107, 0.2)' : 'transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem'
              }}
              onMouseEnter={(e) => {
                if (selectedIndex !== index) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedIndex !== index) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span style={{ opacity: 0.6 }}>
                {query.length === 0 ? '🕒' : '🔍'}
              </span>
              <span>{suggestion}</span>
            </div>
          ))}

          {filteredSuggestions.length === 0 && query.length > 0 && (
            <div style={{
              padding: '1rem',
              color: '#ffffff',
              opacity: 0.6,
              textAlign: 'center'
            }}>
              No suggestions found
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SmartSearch;