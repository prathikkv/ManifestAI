'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LogOut,
  Brain,
  Eye,
  BarChart3,
  Menu
} from 'lucide-react';
import TodaysFocus from '@/components/TodaysFocus';

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    router.push('/auth/login');
    return null;
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 manifestation-gradient rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your focus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Simplified Mobile-First Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 manifestation-gradient rounded-full" />
              <span className="text-xl font-bold text-foreground">ManifestAI</span>
            </Link>
            
            {/* Mobile Navigation */}
            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.firstName}</p>
                <p className="text-xs text-muted-foreground">Today's Focus</p>
              </div>
              
              <SignOutButton redirectUrl="/">
                <button
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile-First Today's Focus */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <TodaysFocus />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border lg:hidden">
        <div className="grid grid-cols-4 h-16">
          <Link 
            href="/dashboard" 
            className="flex flex-col items-center justify-center text-primary border-t-2 border-primary"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Focus</span>
          </Link>
          
          <Link 
            href="/coach" 
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Brain className="w-5 h-5" />
            <span className="text-xs mt-1">Coach</span>
          </Link>
          
          <Link 
            href="/vision-board" 
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Eye className="w-5 h-5" />
            <span className="text-xs mt-1">Vision</span>
          </Link>
          
          <Link 
            href="/dreams" 
            className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs mt-1">More</span>
          </Link>
        </div>
      </nav>

      {/* Padding for bottom navigation on mobile */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}