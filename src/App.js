import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { ThemeProvider, ThemeToggle } from './components/ThemeProvider';
import { NotificationProvider } from './components/NotificationSystem';
import GlobalBackground from './components/GlobalBackground';
import Landing from './components/Landing';
import AdvancedFactCheck from './components/AdvancedFactCheck';
import Result from './components/Result';
import './App.css';

function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <NotificationProvider>
          <div className="App">
            <GlobalBackground />
            <ThemeToggle />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/fact-check" element={<AdvancedFactCheck />} />
              <Route path="/result" element={<Result />} />
            </Routes>
          </div>
        </NotificationProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
