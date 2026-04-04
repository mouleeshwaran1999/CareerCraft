// File: src/components/export/ExportPage.tsx
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResumeStore } from '../../store/resumeStore';
import ResumePreview from '../preview/ResumePreview';
import { APP_NAME } from '../../config/appConfig';
import type { Resume } from '../../types/resume';

export default function ExportPage() {
  const { resume, displaySettings, importResume, resetResume } = useResumeStore();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: resume.header.name ? `${resume.header.name} — Resume | ${APP_NAME}` : `Resume | ${APP_NAME}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; }
        .resume-page-inner { box-shadow: none !important; min-height: 0 !important; }
      }
    `,
  });

  const handleExportJSON = () => {
    const data = JSON.stringify(resume, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as Resume;
        if (!parsed?.meta || !parsed?.header || !parsed?.sections) {
          alert('Invalid resume JSON file.');
          return;
        }
        if (confirm('This will replace your current resume data. Continue?')) {
          importResume(parsed);
          alert('Resume imported successfully!');
        }
      } catch {
        alert('Failed to parse JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('Reset to sample resume? This will overwrite your current data.')) {
      resetResume();
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Export & Import</h1>
        <p className="text-sm text-gray-500">Download your resume as PDF or JSON, or import an existing one.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* PDF Export */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-3xl mb-3">📄</div>
          <h2 className="font-bold text-gray-800 mb-1">Export PDF</h2>
          <p className="text-xs text-gray-500 mb-4">Download your resume as a PDF file via your browser's print-to-PDF feature. Choose "Save as PDF" as the destination.</p>
          <button
            onClick={() => handlePrint()}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
            aria-label="Download resume as PDF"
          >
            ⬇ Download PDF
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center">Tip: Set margins to "None" in the download dialog for best results.</p>
        </div>

        {/* JSON Export */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-3xl mb-3">💾</div>
          <h2 className="font-bold text-gray-800 mb-1">Export JSON</h2>
          <p className="text-xs text-gray-500 mb-4">Save your resume data as a JSON file to back up or share between devices.</p>
          <button
            onClick={handleExportJSON}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
            aria-label="Export resume as JSON"
          >
            ⬇ Export JSON
          </button>
        </div>

        {/* JSON Import */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="text-3xl mb-3">📥</div>
          <h2 className="font-bold text-gray-800 mb-1">Import JSON</h2>
          <p className="text-xs text-gray-500 mb-4">Load a previously exported JSON file to restore your resume data.</p>
          <label
            className="block w-full bg-violet-600 text-white py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-violet-700 transition-colors cursor-pointer"
            aria-label="Import resume from JSON file"
          >
            ⬆ Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} className="sr-only" aria-hidden="true" />
          </label>
          <button
            onClick={handleReset}
            className="w-full mt-2 border border-gray-300 text-gray-600 py-2 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
            aria-label="Reset to sample resume"
          >
            ↺ Reset to Sample
          </button>
        </div>
      </div>

      {/* Print Preview */}
      <div className="bg-gray-200 rounded-xl p-4 md:p-6">
        <p className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide">PDF Preview — A4 (fit to screen)</p>
        <ResumePreview resume={resume} displaySettings={displaySettings} printRef={printRef} />
      </div>
    </div>
  );
}
