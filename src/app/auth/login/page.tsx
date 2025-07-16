'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Mock authentication - in production, this would call an API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      localStorage.setItem('user', JSON.stringify({ 
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0]
      }));
      
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 manifestation-gradient rounded-full" />
            <span className="text-2xl font-bold text-foreground">ManifestAI</span>
          </Link>

          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-center mb-8">
            Sign in to continue your manifestation journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          By signing in, you agree to our{' '}
          <Link href="#" className="underline">Terms</Link> and{' '}
          <Link href="#" className="underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}