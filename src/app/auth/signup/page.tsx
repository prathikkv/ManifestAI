'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingSpots, setRemainingSpots] = useState(127);

  useEffect(() => {
    // Safely handle localStorage on client side
    if (typeof window !== 'undefined') {
      const currentCount = parseInt(localStorage.getItem('userCount') || '373');
      setRemainingSpots(500 - currentCount);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Mock signup - in production, this would call an API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email: formData.email,
        name: formData.name,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      
      // In a real app, we'd also update the user counter here
      const currentCount = parseInt(localStorage.getItem('userCount') || '373');
      localStorage.setItem('userCount', (currentCount + 1).toString());
      
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 manifestation-gradient rounded-full" />
            <span className="text-2xl font-bold text-foreground">ManifestAI</span>
          </Link>

          <h1 className="text-2xl font-bold text-center mb-2">Start Your Journey</h1>
          <p className="text-muted-foreground text-center mb-4">
            Create your free account and join the manifestation movement
          </p>

          <div className="bg-primary/10 text-primary text-center py-2 px-4 rounded-lg mb-6 text-sm font-semibold">
            🎉 Only {remainingSpots} free spots remaining!
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {loading ? 'Creating Account...' : 'Create Free Account'}
            </button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" id="terms" required className="rounded" />
              <label htmlFor="terms">
                I agree to the{' '}
                <Link href="#" className="underline">Terms</Link> and{' '}
                <Link href="#" className="underline">Privacy Policy</Link>
              </label>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}