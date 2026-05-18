'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import Link from 'next/link';
import { login } from '@/app/api/auth/actions';

export default function LoginPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleLogin(formData: FormData) {
    setStatus('loading');
    setMessage('');
    const result = await login(formData);

    if (result?.error) {
      setStatus('error');
      setMessage(result.error);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <img src="/images/logos/bmsa-logo-h.png" alt="BMSA Benisuef" />
        <h1>Admin Login</h1>
        <p>Sign in with a Supabase user listed in the admin_users table.</p>
        <form action={handleLogin}>
          <label htmlFor="login-email" className="login-label">
            Email
            <input id="login-email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
          </label>
          <label htmlFor="login-password" className="login-label">
            Password
            <input id="login-password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
          </label>
          <button className="button primary full" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>
          {status === 'error' ? <div className="form-notice error">{message}</div> : null}
        </form>
        <Link href="/">View public site</Link>
      </section>
    </main>
  );
}
