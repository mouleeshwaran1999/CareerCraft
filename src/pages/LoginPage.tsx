// File: src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { login } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { useResumeStore } from '../store/resumeStore';
import { APP_NAME } from '../config/appConfig';

export default function LoginPage() {
  const setUser = useAuthStore((s) => s.setUser);
  const setPage = useResumeStore((s) => s.setPage);

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(emailOrUsername, password);
    setLoading(false);
    if (result.ok && result.user) {
      setUser(result.user);
      setPage('dashboard' as Parameters<typeof setPage>[0]);
    } else {
      setError(result.error ?? 'Login failed.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <span className="text-3xl font-black text-blue-600">CC</span>
          <h1 className="text-xl font-bold text-gray-900 mt-2">{APP_NAME}</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to access your resumes</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="emailOrUsername" className="block text-xs font-semibold text-gray-700 mb-1">
              Email or Username
            </label>
            <input
              id="emailOrUsername"
              type="text"
              autoComplete="username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => setPage('signup' as Parameters<typeof setPage>[0])}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>

        <p className="text-center text-xs text-gray-400 mt-4">
          <button
            onClick={() => setPage('templates' as Parameters<typeof setPage>[0])}
            className="hover:underline"
          >
            ← Continue without account
          </button>
        </p>
      </div>
    </div>
  );
}
