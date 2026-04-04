// File: src/services/resumeService.ts
// All resume persistence operations for authenticated users.
// Replace with API calls here when adding a backend.

import { v4 as uuidv4 } from 'uuid';
import { dbLoad, dbUpdate, type DbResume } from './localDb';
import type { Resume } from '../types/resume';

// ─── List resumes for a user ──────────────────────────────────────────────────

export function listResumes(userId: string): DbResume[] {
  const db = dbLoad();
  const userResumes = db.resumes[userId] ?? {};
  return Object.values(userResumes).sort((a, b) => b.updatedAt - a.updatedAt);
}

// ─── Get a single resume ──────────────────────────────────────────────────────

export function getResume(userId: string, resumeId: string): DbResume | null {
  const db = dbLoad();
  return db.resumes[userId]?.[resumeId] ?? null;
}

// ─── Save (create or update) a resume ────────────────────────────────────────

export function saveResume(userId: string, resumeData: Resume, existingId?: string): DbResume {
  const id = existingId ?? uuidv4();
  const now = Date.now();

  const record: DbResume = {
    id,
    title: resumeData.meta.title || 'Untitled Resume',
    updatedAt: now,
    createdAt: now,
    data: resumeData,
  };

  dbUpdate((db) => {
    if (!db.resumes[userId]) db.resumes[userId] = {};
    const existing = db.resumes[userId][id];
    if (existing) {
      record.createdAt = existing.createdAt; // preserve original creation time
    }
    db.resumes[userId][id] = record;
  });

  return record;
}

// ─── Duplicate a resume ───────────────────────────────────────────────────────

export function duplicateResume(userId: string, resumeId: string): DbResume | null {
  const existing = getResume(userId, resumeId);
  if (!existing) return null;

  const copy: Resume = {
    ...existing.data,
    meta: {
      ...existing.data.meta,
      title: `${existing.data.meta.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  return saveResume(userId, copy);
}

// ─── Delete a resume ──────────────────────────────────────────────────────────

export function deleteResume(userId: string, resumeId: string): void {
  dbUpdate((db) => {
    if (db.resumes[userId]) {
      delete db.resumes[userId][resumeId];
    }
  });
}
