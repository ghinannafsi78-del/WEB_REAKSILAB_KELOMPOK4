import { useState } from 'react';
import './Navbar.css';

/**
 * Navbar.jsx
 * Komponen navigasi utama REAKSI LAB
 * Mendukung desktop dan tampilan mobile dengan drawer responsif
 */
export default function Navbar({ activePage = 'beranda', onNavigate, overallProgress = 0, currentTheme = 'dark', onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'materi', label: 'Materi' },
    { id: 'lab', label: 'Laboratorium Virtual' },
    { id: 'kuis', label: 'Kuis' },
    { id: 'progres', label: 'Progres Belajar' },
  ];

  const handleNavClick = (pageId) => {
    if (onNavigate) {
      onNavigate(pageId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header" role="banner">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <button
          className="navbar-brand"
          onClick={() => handleNavClick('beranda')}
          aria-label="Kembali ke Beranda REAKSI LAB"
        >
          <div className="brand-icon-box" aria-hidden="true">
            <svg
              className="flask-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 2v7.31L4.69 19.3A2 2 0 0 0 6.44 22h11.12a2 2 0 0 0 1.75-2.7L14 9.31V2" />
              <path d="M8.5 2h7" />
              <path d="M7.4 15h9.2" />
              <circle cx="10" cy="18" r="0.8" fill="currentColor" />
              <circle cx="14" cy="17" r="0.8" fill="currentColor" />
            </svg>
          </div>
          <div className="brand-text-group">
            <span className="brand-name">
              REAKSI <span className="brand-name-highlight">LAB</span>
            </span>
            <span className="brand-tagline">Laboratorium Kimia Interaktif</span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="navbar-nav desktop-nav" aria-label="Navigasi Utama">
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    id={`nav-link-${item.id}`}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                    {isActive && <span className="nav-active-indicator" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action Controls: Progress Badge + Theme Toggle + Mobile Menu Button */}
        <div className="navbar-actions">
          {/* Quick Progress Indicator */}
          <div
            className="navbar-progress-pill"
            title={`Progres Belajar: ${overallProgress}%`}
            onClick={() => handleNavClick('progres')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNavClick('progres')}
          >
            <span className="progress-dot" aria-hidden="true"></span>
            <span className="progress-text">{overallProgress}% Selesai</span>
          </div>

          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              id="theme-toggle"
              className="navbar-icon-btn"
              onClick={onToggleTheme}
              aria-label={currentTheme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
              title="Ganti Tema"
            >
              {currentTheme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            id="mobile-menu-toggle"
            className="navbar-icon-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <nav className="mobile-nav" aria-label="Navigasi Mobile">
            <ul className="mobile-nav-list">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <li key={item.id} className="mobile-nav-item">
                    <button
                      className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span>{item.label}</span>
                      {isActive && <span className="mobile-active-check">✓</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
