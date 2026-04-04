// File: src/App.tsx
import React from 'react';
import { useResumeStore } from './store/resumeStore';
import Navbar from './components/layout/Navbar';
import TemplateGallery from './components/gallery/TemplateGallery';
import EditorPage from './pages/EditorPage';
import ATSChecker from './components/ats/ATSChecker';
import ExportPage from './components/export/ExportPage';
import { ToastProvider } from './hooks/useToast';

export default function App() {
  const { currentPage } = useResumeStore();

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
