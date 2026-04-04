// File: src/services/localDb.ts
// All direct localStorage access is isolated here.
// Swap this file's implementation to replace with API calls later.

import type { Resume } from '../types/resume';

export const DB_KEY = 'careercraft_db';

// ─── DB Shape ─────────────────────────────────────────────────────────────────

export interface DbUser {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: number;
}

export interface DbResume {
  id: string;
  title: string;
  updatedAt: number;
  createdAt: number;
  data: Resume;
}

export interface DbSession {
  currentUserId: string | null;
}

export interface Db {
  users: Record<string, DbUser>;
  resumes: Record<string, Record<string, DbResume>>; // resumes[userId][resumeId]
  session: DbSession;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function emptyDb(): Db {
  return { users: {}, resumes: {}, session: { currentUserId: null } };
}

export function dbLoad(): Db {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Db>;
      return {
        users: parsed.users ?? {},
        resumes: parsed.resumes ?? {},
        session: parsed.session ?? { currentUserId: null },
      };
    }
  } catch { /* corrupt — reset */ }
  return emptyDb();
}

export function dbSave(db: Db): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch { /* quota exceeded — silently ignore */ }
}

/** Read-modify-write helper */
export function dbUpdate(fn: (db: Db) => void): Db {
  const db = dbLoad();
  fn(db);
  dbSave(db);
  return db;
}
