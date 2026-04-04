// File: src/store/authStore.ts
// Auth state — completely separate from resumeStore to avoid touching existing logic.

import { create } from 'zustand';
import { getSessionUser, logout as doLogout } from '../services/authService';
import type { DbUser } from '../services/localDb';

interface AuthStore {
  user: DbUser | null;
  /** Hydrate from persisted session on app load */
  init: () => void;
  setUser: (user: DbUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  init() {
    const user = getSessionUser();
    set({ user });
  },

  setUser(user) {
    set({ user });
  },

  logout() {
    doLogout();
    set({ user: null });
  },
}));
