// File: src/App.tsx
import React, { useEffect } from 'react';
import { useResumeStore } from './store/resumeStore';
import { useAuthStore } from './store/authStore';
import Navbar from './components/layout/Navbar';
import TemplateGallery from './components/gallery/TemplateGallery';
import EditorPage from './pages/EditorPage';
import ATSChecker from './components/ats/ATSChecker';
import ExportPage from './components/export/ExportPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import { ToastProvider } from './hooks/useToast';

export default function App() {
  const { currentPage, setPage } = useResumeStore();
  const { init, user } = useAuthStore();

  // Hydrate auth session on first render
  useEffect(() => { init(); }, [init]);

  // Auth guard
  const protectedPages = new Set(['templates', 'editor', 'ats', 'export']);
  useEffect(() => {
    if (protectedPages.has(currentPage) && !user) {
      // Unauthenticated user trying to reach editor → back to login
      setPage('login');
    } else if ((currentPage === 'login' || currentPage === 'signup') && user) {
      // Already logged-in user landing on login/signup → straight to dashboard
      setPage('dashboard');
    }
  }, [currentPage, user]);

  // Auth-only pages — render without Navbar
  if (currentPage === 'login') return <LoginPage />;
  if (currentPage === 'signup') return <SignupPage />;
  if (currentPage === 'dashboard') return <DashboardPage />;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-hidden" role="main">
          {currentPage === 'templates' && <div className="overflow-y-auto h-[calc(100vh-56px)]"><TemplateGallery /></div>}
          {currentPage === 'editor' && <EditorPage />}
          {currentPage === 'ats' && <div className="overflow-y-auto h-[calc(100vh-56px)]"><ATSChecker /></div>}
          {currentPage === 'export' && <div className="overflow-y-auto h-[calc(100vh-56px)]"><ExportPage /></div>}
        </main>
      </div>
    </ToastProvider>
  );
}
