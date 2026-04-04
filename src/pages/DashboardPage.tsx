// File: src/pages/DashboardPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useResumeStore } from '../store/resumeStore';
import { listResumes, saveResume, duplicateResume, deleteResume } from '../services/resumeService';
import { SAMPLE_RESUME } from '../data/sampleResume';
import type { DbResume } from '../services/localDb';
import type { Resume } from '../types/resume';
import { APP_NAME } from '../config/appConfig';
import { v4 as uuidv4 } from 'uuid';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function blankResume(): Resume {
  return {
    ...SAMPLE_RESUME,
    meta: {
      version: 2,
      title: 'New Resume',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    header: {
      name: '',
      title: '',
      tagline: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      photo: '',
    },
  };
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { setPage, importResume } = useResumeStore();

  const [resumes, setResumes] = useState<DbResume[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (user) setResumes(listResumes(user.id));
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  function handleCreateNew() {
    if (!user) return;
    const blank = blankResume();
    const record = saveResume(user.id, blank);
    // Store the db resume id so editor can save back to same record
    sessionStorage.setItem('cc_editing_resume_id', record.id);
    importResume(blank);
    setPage('editor');
  }

  function handleEdit(r: DbResume) {
    sessionStorage.setItem('cc_editing_resume_id', r.id);
    importResume(r.data);
    setPage('editor');
  }

  function handleDuplicate(r: DbResume) {
    if (!user) return;
    duplicateResume(user.id, r.id);
    refresh();
  }

  function handleDelete(id: string) {
    if (!user) return;
    deleteResume(user.id, id);
    setConfirmDeleteId(null);
    refresh();
  }

  function handleLogout() {
    logout();
    setPage('login');
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <span className="text-xl font-black text-blue-600">CC</span>
          <span className="font-bold text-gray-800">{APP_NAME}</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">Dashboard</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium hidden sm:block">
              Hi, {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {resumes.length === 0 ? 'No resumes yet — create your first one!' : `${resumes.length} resume${resumes.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <span>＋</span> New Resume
          </button>
        </div>

        {/* Resume grid */}
        {resumes.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">📄</div>
            <p className="text-gray-500 font-medium mb-6">You haven't saved any resumes yet.</p>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Create First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-900 truncate text-sm">{r.title || 'Untitled Resume'}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Updated {formatDate(r.updatedAt)}</p>
                  </div>
                  <span className="text-2xl ml-2">📄</span>
                </div>

                {/* Template badge */}
                {r.data.styles?.templateId && (
                  <span className="self-start text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5 capitalize font-medium">
                    {r.data.styles.templateId}
                  </span>
                )}

                <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(r)}
                    className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDuplicate(r)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    title="Duplicate"
                  >
                    ⧉
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(r.id)}
                    className="px-3 py-1.5 border border-red-200 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick tips */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
          <strong>Tip:</strong> After editing, click <strong>Save to Dashboard</strong> in the editor toolbar to persist your changes here.
        </div>
      </main>

      {/* Confirm delete modal */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete"
        >
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-xl">
            <h3 className="font-bold text-gray-900 mb-2">Delete resume?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
