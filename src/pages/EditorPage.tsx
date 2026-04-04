// File: src/pages/EditorPage.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResumeStore } from '../store/resumeStore';
import { useAuthStore } from '../store/authStore';
import { saveResume } from '../services/resumeService';
import HeaderEditor from '../components/editor/HeaderEditor';
import SectionManager from '../components/editor/SectionManager';
import StylePanel from '../components/editor/StylePanel';
import ResumePreview from '../components/preview/ResumePreview';
import { APP_NAME } from '../config/appConfig';

type LeftTab = 'header' | 'sections' | 'style';
type MobileView = 'edit' | 'preview';

const ZOOM_LEVELS = [0, 75, 100, 125] as const;

export default function EditorPage() {
  const { resume, displaySettings, undo, redo, past, future, setPage } = useResumeStore();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<LeftTab>('header');
  const [mobileView, setMobileView] = useState<MobileView>('edit');
  const [zoom, setZoom] = useState<number>(0); // 0 = fit
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [dashSaveStatus, setDashSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const printRef = useRef<HTMLDivElement>(null);
  const lastUpdatedAt = useRef(resume.meta.updatedAt);

  function handleSaveToDashboard() {
    if (!user) { setPage('login'); return; }
    setDashSaveStatus('saving');
    const existingId = sessionStorage.getItem('cc_editing_resume_id') ?? undefined;
    const record = saveResume(user.id, resume, existingId);
    sessionStorage.setItem('cc_editing_resume_id', record.id);
    setTimeout(() => setDashSaveStatus('saved'), 400);
    setTimeout(() => setDashSaveStatus('idle'), 2500);
  }

  // Autosave feedback
  useEffect(() => {
    if (resume.meta.updatedAt !== lastUpdatedAt.current) {
      lastUpdatedAt.current = resume.meta.updatedAt;
      setSaveStatus('saving');
      const t = setTimeout(() => setSaveStatus('saved'), 700);
      return () => clearTimeout(t);
    }
  }, [resume.meta.updatedAt]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: resume.header.name
      ? `${resume.header.name} — Resume | ${APP_NAME}`
      : `Resume | ${APP_NAME}`,
    pageStyle: `
      @page { size: A4; margin: 0; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; }
        .resume-page-inner { box-shadow: none !important; }
      }
    `,
  });

  const tabs: { key: LeftTab; label: string }[] = [
    { key: 'header', label: 'Contact' },
    { key: 'sections', label: 'Sections' },
    { key: 'style', label: 'Style' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-hidden">
      {/* Mobile pane toggle */}
      <div className="md:hidden flex shrink-0 bg-white border-b border-gray-200 no-print" role="tablist" aria-label="Editor view">
        <button
          role="tab" aria-selected={mobileView === 'edit'}
          onClick={() => setMobileView('edit')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors border-b-2 ${mobileView === 'edit' ? 'border-blue-500 text-blue-600 bg-blue-50/40' : 'border-transparent text-gray-500'}`}
        >
          <span aria-hidden="true">✏️</span> Edit
        </button>
        <button
          role="tab" aria-selected={mobileView === 'preview'}
          onClick={() => setMobileView('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors border-b-2 ${mobileView === 'preview' ? 'border-blue-500 text-blue-600 bg-blue-50/40' : 'border-transparent text-gray-500'}`}
        >
          <span aria-hidden="true">👁</span> Preview
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Editor panel ─────────────────────────────────────────── */}
        <div
          className={`${mobileView === 'edit' ? 'flex' : 'hidden'} md:flex flex-col border-r border-gray-200 bg-white w-full md:w-[400px] md:min-w-[340px] md:max-w-[440px] no-print`}
        >
          {/* Undo / Redo / autosave */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 shrink-0">
            <button onClick={undo} disabled={past.length === 0}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Undo" title="Undo (Ctrl+Z)">
              ↩ Undo
            </button>
            <button onClick={redo} disabled={future.length === 0}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Redo" title="Redo (Ctrl+Y)">
              ↪ Redo
            </button>
            <span className="ml-auto text-xs min-w-[92px] text-right" aria-live="polite" aria-atomic="true">
              {saveStatus === 'saving' && <span className="text-amber-500 font-medium">⏳ Saving…</span>}
              {saveStatus === 'saved'  && <span className="text-green-600 font-medium">✓ Saved</span>}
              {saveStatus === 'idle'   && <span className="text-gray-400">Autosave: ON</span>}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 shrink-0" role="tablist" aria-label="Editor panels">
            {tabs.map((tab) => (
              <button key={tab.key} role="tab"
                aria-selected={activeTab === tab.key}
                aria-controls={`panel-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2 ${activeTab === tab.key ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4" id={`panel-${activeTab}`} role="tabpanel">
            {activeTab === 'header'   && <HeaderEditor />}
            {activeTab === 'sections' && <SectionManager />}
            {activeTab === 'style'    && <StylePanel />}
          </div>
        </div>

        {/* ── Right: Live preview ────────────────────────────────────────── */}
        <div
          className={`${mobileView === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 flex-col overflow-hidden bg-gray-200`}
        >
          {/* Preview toolbar */}
          <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-100 border-b border-gray-300 no-print flex-wrap">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide hidden sm:inline">Preview</span>
            <span className="text-xs bg-white text-gray-600 border border-gray-200 rounded px-2 py-0.5 capitalize hidden sm:inline">
              {resume.styles.templateId}
            </span>

            {/* Zoom controls */}
            <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg p-0.5 ml-0 sm:ml-2" role="group" aria-label="Zoom controls">
              {ZOOM_LEVELS.map((z) => (
                <button
                  key={z}
                  onClick={() => setZoom(z)}
                  className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${zoom === z ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  aria-pressed={zoom === z}
                  title={z === 0 ? 'Fit to screen' : `Zoom to ${z}%`}
                >
                  {z === 0 ? 'Fit' : `${z}%`}
                </button>
              ))}
            </div>

            {/* Save to Dashboard */}
            <button
              onClick={handleSaveToDashboard}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              aria-label="Save to dashboard"
              title={user ? 'Save resume to your dashboard' : 'Sign in to save'}
            >
              {dashSaveStatus === 'saved' ? '✓ Saved' : dashSaveStatus === 'saving' ? '…' : '💾'}
              <span className="hidden sm:inline">{dashSaveStatus === 'saved' ? 'Saved!' : 'Save'}</span>
            </button>

            {/* Download button */}
            <button
              onClick={() => handlePrint()}
              className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              aria-label="Download PDF"
              title="Download resume as PDF"
            >
              <span>⬇</span>
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>

          {/* Scrollable preview area */}
          <div className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-6">
            <ResumePreview
              resume={resume}
              displaySettings={displaySettings}
              printRef={printRef}
              zoom={zoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

