// File: src/components/layout/Navbar.tsx
import React, { useState } from 'react';
import { useResumeStore, type AppPage } from '../../store/resumeStore';
import { useAuthStore } from '../../store/authStore';
import { APP_NAME, APP_TAGLINE } from '../../config/appConfig';

const NAV_ITEMS: { key: AppPage; label: string; icon: string }[] = [
  { key: 'editor', label: 'Editor', icon: '✏️' },
  { key: 'ats', label: 'ATS Checker', icon: '📊' },
  { key: 'export', label: 'Export', icon: '📤' },
];

export default function Navbar() {
  const { currentPage, setPage, resume, atsResult } = useResumeStore();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNav(page: AppPage) {
    setPage(page);
    setMenuOpen(false);
  }

  const atsScore = atsResult?.totalScore;
  const atsBadgeColor = atsScore == null ? '' : atsScore >= 75 ? 'bg-green-500' : atsScore >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50" role="banner">
      <div className="h-14 flex items-center px-4 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-4 flex-shrink-0 select-none">
          <span className="text-xl font-black text-blue-600 leading-none">CC</span>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-gray-900 leading-tight">{APP_NAME}</div>
            <div className="text-[10px] text-gray-400 leading-tight">{APP_TAGLINE}</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-1 flex-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.key ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-current={currentPage === item.key ? 'page' : undefined}
            >
              <span>{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
              {item.key === 'ats' && atsScore != null && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full text-white ${atsBadgeColor}`} aria-label={`ATS score: ${atsScore}`}>
                  {atsScore}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Resume name — desktop only */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400 ml-auto">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
          <span className="font-medium text-gray-600 truncate max-w-40">{resume.header.name || 'Untitled Resume'}</span>
        </div>

        {/* Auth controls — desktop */}
        <div className="hidden sm:flex items-center gap-2 ml-2">
          {user ? (
            <>
              <button
                onClick={() => { setMenuOpen(false); setPage('dashboard'); }}
                className="text-xs px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium"
              >
                My Resumes
              </button>
              <button
                onClick={() => { logout(); setPage('login'); }}
                className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => { setMenuOpen(false); setPage('login'); }}
              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="sm:hidden ml-auto p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div id="mobile-nav-menu" className="sm:hidden border-t border-gray-100 bg-white pb-2 px-3" role="navigation" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm font-medium transition-colors mt-1 ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.key === 'ats' && atsScore != null && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${atsBadgeColor}`}>{atsScore}</span>
                )}
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />}
              </button>
            );
          })}
          <div className="mt-2 pt-2 border-t border-gray-100 px-3 flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" aria-hidden="true" />
            <span className="truncate">{resume.header.name || 'Untitled Resume'}</span>
          </div>
          {/* Mobile auth controls */}
          <div className="mt-2 pt-2 border-t border-gray-100 px-1">
            {user ? (
              <>
                <button
                  onClick={() => { setMenuOpen(false); setPage('dashboard'); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>🗂</span> My Resumes
                </button>
                <button
                  onClick={() => { setMenuOpen(false); logout(); setPage('login'); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>🚪</span> Sign Out ({user.username})
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); setPage('login'); }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <span>👤</span> Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
