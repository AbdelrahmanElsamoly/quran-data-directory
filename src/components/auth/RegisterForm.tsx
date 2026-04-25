'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [display_name, setDisplayName] = useState('');
  const [role, setRole] = useState<'developer' | 'publisher'>('developer');
  const { register, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register(email, password, display_name, role);
    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="reg-name" className="block text-sm font-heading text-[var(--text-secondary)] mb-1">
          Display Name
        </label>
        <input
          id="reg-name"
          type="text"
          value={display_name}
          onChange={(e) => setDisplayName(e.target.value)}
          className="input-field"
          required
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-heading text-[var(--text-secondary)] mb-1">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-heading text-[var(--text-secondary)] mb-1">
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-sm font-heading text-[var(--text-secondary)] mb-1">
          I am a…
        </label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="developer"
              checked={role === 'developer'}
              onChange={() => setRole('developer')}
              className="w-4 h-4 text-[var(--accent-primary)]"
            />
            <span className="text-sm">Developer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="publisher"
              checked={role === 'publisher'}
              onChange={() => setRole('publisher')}
              className="w-4 h-4 text-[var(--accent-primary)]"
            />
            <span className="text-sm">Publisher</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
}
