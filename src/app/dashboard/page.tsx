'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Brain, 
  Heart, 
  Sparkles, 
  Plus,
  Eye,
  MessageCircle,
  BarChart3,
  LogOut,
  Trophy,
  Flame,
  Star,
  Crown,
  Zap,
  Gift,
  Medal,
  Award
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAchievement, setShowAchievement] = useState(false);

  // Gamification data
  const userLevel = 3;
  const streakDays = 7;
  const totalPoints = 1250;
  const nextLevelPoints = 1500;
  const achievements = [
    { id: 1, title: 'First Dream', icon: Target, color: 'text-blue-500', unlocked: true },
    { id: 2, title: 'Week Streak', icon: Flame, color: 'text-orange-500', unlocked: true },
    { id: 3, title: 'Dream Achiever', icon: Trophy, color: 'text-yellow-500', unlocked: true },
    { id: 4, title: 'Goal Crusher', icon: Crown, color: 'text-purple-500', unlocked: false },
    { id: 5, title: 'Manifestation Master', icon: Star, color: 'text-pink-500', unlocked: false },
  ];

  const levelTitles = {
    1: 'Dream Apprentice',
    2: 'Goal Getter',
    3: 'Manifestation Enthusiast',
    4: 'Dream Achiever',
    5: 'Manifestation Master'
  };

  const motivationalMessages = [
    "You're on fire! 🔥 Keep manifesting those dreams!",
    "Every step forward is progress. You've got this! 💪",
    "Your dreams are getting closer to reality! ✨",
    "Amazing progress! The universe is aligning for you! 🌟",
    "You're becoming unstoppable! Keep going! 🚀"
  ];

  const todayMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const stats = [
    {
      title: 'Dreams Created',
      value: '3',
      change: '+2 this week',
      icon: Target,
      color: 'text-blue-500'
    },
    {
      title: 'Days Active',
      value: '7',
      change: 'Welcome!',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Vision Boards',
      value: '2',
      change: '+1 this week',
      icon: Eye,
      color: 'text-purple-500'
    },
    {
      title: 'AI Conversations',
      value: '12',
      change: '+8 this week',
      icon: MessageCircle,
      color: 'text-pink-500'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Dream',
      description: 'Start manifesting a new goal',
      icon: Plus,
      href: '/dreams/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Daily Rituals',
      description: 'Track habits & tasks',
      icon: Calendar,
      href: '/rituals',
      color: 'bg-indigo-500'
    },
    {
      title: 'AI Coach Chat',
      description: 'Get personalized guidance',
      icon: Brain,
      href: '/coach',
      color: 'bg-purple-500'
    },
    {
      title: 'Vision Board',
      description: 'Create visual inspiration',
      icon: Sparkles,
      href: '/vision-board',
      color: 'bg-pink-500'
    },
    {
      title: 'View All Dreams',
      description: 'Track your progress',
      icon: BarChart3,
      href: '/dreams',
      color: 'bg-green-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 manifestation-gradient rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dreams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 manifestation-gradient rounded-full" />
              <span className="text-2xl font-bold text-foreground">ManifestAI</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-primary font-semibold">Dashboard</Link>
              <Link href="/dreams" className="text-muted-foreground hover:text-foreground">Dreams</Link>
              <Link href="/vision-board" className="text-muted-foreground hover:text-foreground">Vision Board</Link>
              <Link href="/coach" className="text-muted-foreground hover:text-foreground">AI Coach</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {user?.name}! 🌟
              </h1>
              <p className="text-muted-foreground">
                {todayMessage}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-semibold text-foreground">
                  Level {userLevel} - {levelTitles[userLevel as keyof typeof levelTitles]}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">
                  {streakDays} day streak
                </span>
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  {totalPoints} points
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Progress to Level {userLevel + 1}</span>
              <span className="text-sm text-muted-foreground">{totalPoints}/{nextLevelPoints} points</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(totalPoints / nextLevelPoints) * 100}%` }}
              />
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Recent Achievements
            </h3>
            <div className="flex items-center space-x-3">
              {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center space-x-2 bg-secondary/50 rounded-lg px-3 py-2"
                >
                  <achievement.icon className={`w-4 h-4 ${achievement.color}`} />
                  <span className="text-sm font-medium text-foreground">{achievement.title}</span>
                </div>
              ))}
              <Link 
                href="/achievements" 
                className="text-sm text-primary hover:underline flex items-center"
              >
                View all <Award className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="group bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/80 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                {index === 1 && streakDays >= 7 && (
                  <div className="flex items-center space-x-1">
                    <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                    <span className="text-xs font-bold text-orange-500">HOT!</span>
                  </div>
                )}
              </div>
              <div className="relative">
                <h3 className="text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-primary font-semibold">{stat.change}</p>
                  {stat.change.includes('+') && (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  )}
                </div>
              </div>
              
              {/* Progress ring for dreams */}
              {index === 0 && (
                <div className="absolute top-4 right-4">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        className="text-secondary"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - 0.6)}`}
                        className="text-primary transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">60%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Daily Challenge */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Daily Challenge</h3>
                  <p className="text-sm text-muted-foreground">Complete to earn 50 points</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <span className="text-sm font-semibold text-foreground">+50 XP</span>
              </div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 mb-4">
              <p className="text-foreground font-medium mb-2">📝 Update progress on 2 dreams</p>
              <p className="text-sm text-muted-foreground">Keep your momentum going by tracking your dream progress today!</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-secondary rounded-full">
                  <div className="w-12 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full"></div>
                </div>
                <span className="text-sm text-muted-foreground">1/2 completed</span>
              </div>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold">
                Continue Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/80 transition-all duration-300 hover:shadow-lg"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Dreams */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Dreams</h2>
            <Link href="/dreams" className="text-primary hover:underline text-sm">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mock dream cards */}
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Launch My Startup</h3>
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">In Progress</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Building a revolutionary AI product that changes lives...
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">Due in 6 months</span>
                </div>
                <div className="text-right">
                  <div className="w-16 h-2 bg-secondary rounded-full">
                    <div className="w-8 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">50%</span>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Get Healthy & Fit</h3>
                <span className="text-xs text-green-600 bg-green-600/10 px-2 py-1 rounded-full">On Track</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Transform my body and mind through consistent healthy habits...
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs text-muted-foreground">Daily goal</span>
                </div>
                <div className="text-right">
                  <div className="w-16 h-2 bg-secondary rounded-full">
                    <div className="w-12 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-xs text-muted-foreground">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Inspiration */}
        <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl p-8 text-center">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Today's Manifestation</h2>
          <p className="text-lg text-muted-foreground mb-4">
            "The future belongs to those who believe in the beauty of their dreams."
          </p>
          <p className="text-sm text-muted-foreground">— Eleanor Roosevelt</p>
        </div>
      </main>
    </div>
  );
}