import React, { useState, useEffect, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import BrandingPanel from './components/BrandingPanel';
import LoginForm from './components/LoginForm';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ktu-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [sessionExpired, setSessionExpired] = useState(false);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('ktu-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Session timeout simulation (warn after 10 minutes of inactivity)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSessionExpired(true);
      }, 10 * 60 * 1000); // 10 minutes
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, []);

  const toggleDark = useCallback(() => setDarkMode((prev) => !prev), []);
  const dismissSession = useCallback(() => setSessionExpired(false), []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative"
      style={{ background: 'var(--bg-page)', transition: 'background 0.3s ease' }}
    >
      {/* Main Card */}
      <main
        id="main-content"
        className="relative w-full max-w-[1200px] overflow-hidden flex flex-col lg:flex-row animate-fade-in-up"
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
          minHeight: '750px',
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Left Branding Column — hidden below lg */}
        <div
          className="hidden lg:block lg:flex-shrink-0"
          style={{ width: '40%' }}
        >
          <BrandingPanel />
        </div>

        {/* Mobile Top Banner (visible only on small screens) */}
        <div
          className="lg:hidden w-full py-5 px-6 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #0F1F3A 100%)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 flex items-center justify-center flex-shrink-0"
            >
              <img
                src="/ktu-logo.png"
                alt="KTU Logo"
                className="w-full h-full object-contain"
                style={{
                  filter: 'drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff)',
                }}
              />
            </div>
            <div>
              <h1 className="text-white font-serif font-bold text-lg leading-tight">
                APJ Abdul Kalam <span style={{ color: '#D4AF37' }}>Technological University</span>
              </h1>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Secure Governance Portal
              </p>
            </div>
          </div>

          {/* Theme Toggle - Mobile Version */}
          <button
            onClick={toggleDark}
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
            }}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun size={18} style={{ color: '#D4AF37' }} strokeWidth={2.2} />
            ) : (
              <Moon size={18} style={{ color: '#fff' }} strokeWidth={2.2} />
            )}
          </button>
        </div>

        {/* Right Login Form Column */}
        <div className="w-full lg:flex-1 flex items-center justify-center relative">
          {/* Theme Toggle - Desktop Version (hidden on small screens) */}
          <button
            onClick={toggleDark}
            className="hidden lg:flex absolute top-8 right-8 z-50 w-11 h-11 rounded-full items-center justify-center cursor-pointer transition-all duration-300"
            style={{
              background: darkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(30, 58, 95, 0.04)',
              border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(30, 58, 95, 0.1)'}`,
              backdropFilter: 'blur(10px)',
              boxShadow: darkMode ? '0 0 15px rgba(212, 175, 55, 0.2)' : 'none',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1) rotate(15deg)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            }}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun size={18} style={{ color: '#D4AF37' }} strokeWidth={2.2} />
            ) : (
              <Moon size={18} style={{ color: '#1E3A5F' }} strokeWidth={2.2} />
            )}
          </button>
          <LoginForm darkMode={darkMode} />
        </div>
      </main>

      {/* Session Expired Modal */}
      {sessionExpired && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ animation: 'overlayIn 0.3s ease forwards' }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={dismissSession}
          />
          <div
            className="relative w-full max-w-sm p-8 rounded-2xl text-center"
            style={{
              background: 'var(--bg-card)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              animation: 'modalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(var(--ktu-accent-rgb), 0.12)' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3
              className="font-serif font-bold text-xl mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Session Expired
            </h3>
            <p
              className="text-sm font-medium mb-6 leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              To protect your data, your session was terminated after a period of inactivity. Please authenticate again.
            </p>
            <button
              onClick={dismissSession}
              className="w-full h-12 rounded-xl font-bold text-white cursor-pointer btn-shimmer"
              style={{
                background: 'linear-gradient(135deg, #1E3A5F 0%, #2C5282 100%)',
                boxShadow: 'var(--shadow-btn)',
              }}
            >
              Sign In Again
            </button>
          </div>
        </div>
      )}

      {/* Keyboard navigation hint */}
      <div
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wide opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-secondary)',
        }}
        aria-hidden="true"
      >
        Press <kbd className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: 'var(--bg-pill)', border: '1px solid var(--border-default)' }}>Tab</kbd> to navigate
      </div>
    </div>
  );
};

export default App;
