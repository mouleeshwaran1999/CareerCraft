// File: src/services/authService.ts
// Client-only auth. Uses Web Crypto (SHA-256) for password hashing.
// Replace functions here when wiring up a real backend.

import { v4 as uuidv4 } from 'uuid';
import { dbLoad, dbUpdate, type DbUser } from './localDb';

// ─── Password hashing (SHA-256 via Web Crypto) ───────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── Auth results ─────────────────────────────────────────────────────────────

export interface AuthResult {
  ok: boolean;
  user?: DbUser;
  error?: string;
}

// ─── Sign Up ─────────────────────────────────────────────────────────────────

export async function signUp(email: string, username: string, password: string): Promise<AuthResult> {
  email = email.trim().toLowerCase();
  username = username.trim();

  if (!email || !username || !password) {
    return { ok: false, error: 'All fields are required.' };
  }
  if (password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' };
  }

  const db = dbLoad();
  const existing = Object.values(db.users).find(
    (u) => u.email === email || u.username.toLowerCase() === username.toLowerCase()
  );
  if (existing) {
    return { ok: false, error: 'Email or username already registered.' };
  }

  const passwordHash = await hashPassword(password);
  const user: DbUser = {
    id: uuidv4(),
    email,
    username,
    passwordHash,
    createdAt: Date.now(),
  };

  dbUpdate((db) => {
    db.users[user.id] = user;
    db.resumes[user.id] = {};
    db.session.currentUserId = user.id;
  });

  return { ok: true, user };
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function login(emailOrUsername: string, password: string): Promise<AuthResult> {
  emailOrUsername = emailOrUsername.trim().toLowerCase();

  const db = dbLoad();
  const user = Object.values(db.users).find(
    (u) => u.email === emailOrUsername || u.username.toLowerCase() === emailOrUsername
  );
  if (!user) {
    return { ok: false, error: 'Invalid credentials.' };
  }

  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) {
    return { ok: false, error: 'Invalid credentials.' };
  }

  dbUpdate((db) => {
    db.session.currentUserId = user.id;
  });

  return { ok: true, user };
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export function logout(): void {
  dbUpdate((db) => {
    db.session.currentUserId = null;
  });
}

// ─── Get current session ─────────────────────────────────────────────────────

export function getSessionUser(): DbUser | null {
  const db = dbLoad();
  const uid = db.session.currentUserId;
  if (!uid) return null;
  return db.users[uid] ?? null;
}
