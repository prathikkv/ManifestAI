'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Flame, 
  Zap, 
  Heart, 
  CheckCircle2, 
  Circle, 
  Mic, 
  Plus,
  Sparkles,
  Target,
  Calendar,
  TrendingUp,
  User,
  Settings,
  Volume2,
  Headphones,
  Coffee,
  Moon,
  Sun
} from 'lucide-react';

// Habit quick actions for mobile
interface QuickHabit {
  id: string;
  title: string;
  icon: any;
  completed: boolean;
  streak: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  color: string;
}

export default function MobileDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyStreak, setDailyStreak] = useState(7);
  const [energyLevel, setEnergyLevel] = useState(75);
  const [isRecording, setIsRecording] = useState(false);
  const [quickAffirmation, setQuickAffirmation] = useState('');

  // Mock habit data - would come from database
  const [quickHabits, setQuickHabits] = useState<QuickHabit[]>([
    {
      id: '1',
      title: 'Morning Gratitude',
      icon: Sun,
      completed: true,
      streak: 7,
      timeOfDay: 'morning',
      color: 'bg-yellow-500'
    },
    {
      id: '2', 
      title: 'Meditation',
      icon: Headphones,
      completed: false,
      streak: 5,
      timeOfDay: 'morning',
      color: 'bg-purple-500'
    },
    {
      id: '3',
      title: 'Exercise',
      icon: Zap,
      completed: false,
      streak: 3,
      timeOfDay: 'afternoon',
      color: 'bg-orange-500'
    },
    {
      id: '4',
      title: 'Evening Journal',
      icon: Moon,
      completed: false,
      streak: 4,
      timeOfDay: 'evening',
      color: 'bg-blue-500'
    }
  ]);

  // Dynamic affirmations based on time of day
  const timeBasedAffirmations = {
    morning: [
      "Today is full of endless possibilities for me ✨",
      "I wake up grateful and excited for this new day 🌅",
      "My potential is limitless and I'm ready to shine 💫"
    ],
    afternoon: [
      "I am making great progress toward my goals 🚀",
      "I have the energy and focus to accomplish anything 💪",
      "Every challenge is an opportunity for me to grow 🌱"
    ],
    evening: [
      "I celebrated my wins and learned from today 🏆",
      "I am grateful for all that I achieved today 🙏",
      "Tomorrow will bring even more amazing opportunities 🌟"
    ]
  };

  useEffect(() => {
    // Simulate user load
    setTimeout(() => {
      setUser({ name: 'Alex', level: 3 });
    }, 100);

    // Get daily affirmation based on time
    const hour = new Date().getHours();
    let timeOfDay: keyof typeof timeBasedAffirmations = 'morning';
    
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17) timeOfDay = 'evening';
    
    const affirmations = timeBasedAffirmations[timeOfDay];
    setQuickAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);

    // Update time every minute
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleHabit = (habitId: string) => {
    setQuickHabits(habits => 
      habits.map(habit => 
        habit.id === habitId 
          ? { 
              ...habit, 
              completed: !habit.completed,
              streak: !habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1)
            }
          : habit
      )
    );

    // Update energy level based on completion
    const habit = quickHabits.find(h => h.id === habitId);
    if (habit && !habit.completed) {
      setEnergyLevel(prev => Math.min(100, prev + 10));
    }
  };

  const completedHabits = quickHabits.filter(h => h.completed).length;
  const totalHabits = quickHabits.length;
  const completionPercentage = Math.round((completedHabits / totalHabits) * 100);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getTimeOfDayIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return <Sun className="w-5 h-5 text-yellow-500" />;
    if (hour >= 12 && hour < 18) return <Coffee className="w-5 h-5 text-orange-500" />;
    return <Moon className="w-5 h-5 text-blue-500" />;
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
    if (!isRecording) {
      setTimeout(() => setIsRecording(false), 3000); // Auto-stop after 3 seconds for demo
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your day...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getTimeOfDayIcon()}
              <div>
                <p className="text-sm text-gray-600">{getGreeting()}</p>
                <p className="font-semibold text-gray-900">{user.name} ✨</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-orange-600">{dailyStreak}</span>
              </div>
              <button 
                onClick={() => router.push('/profile')}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <User className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Daily Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today's Progress</h2>
            <span className="text-2xl font-bold text-green-600">{completionPercentage}%</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          
          {/* Energy Level */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Energy Level</span>
            </div>
            <span className="font-semibold text-yellow-600">{energyLevel}%</span>
          </div>
        </div>

        {/* Daily Affirmation */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Daily Affirmation</span>
          </div>
          <p className="text-lg leading-relaxed font-medium mb-4">
            {quickAffirmation}
          </p>
          <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
            <Volume2 className="w-4 h-4 inline mr-2" />
            Listen
          </button>
        </div>

        {/* Quick Habits */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Habits</h3>
            <span className="text-sm text-gray-500">{completedHabits}/{totalHabits} done</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {quickHabits.map((habit) => {
              const Icon = habit.icon;
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    habit.completed
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${habit.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center">
                      {habit.title}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-orange-600 font-semibold">{habit.streak}</span>
                    </div>
                  </div>
                  
                  {habit.completed && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleVoiceRecord}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
              isRecording
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
              }`}>
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {isRecording ? 'Recording...' : 'Voice Journal'}
              </span>
            </div>
          </button>

          <button
            onClick={() => router.push('/vision-board/quick')}
            className="p-6 rounded-2xl border-2 border-gray-200 bg-white hover:border-purple-300 transition-all duration-200"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Quick Vision</span>
            </div>
          </button>
        </div>

        {/* Weekly Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <div key={day} className="text-center">
                <p className="text-xs text-gray-500 mb-2">{day}</p>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < 5 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < 5 ? '✓' : '○'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <button className="p-3 text-blue-600">
            <div className="flex flex-col items-center space-y-1">
              <Circle className="w-5 h-5" />
              <span className="text-xs">Today</span>
            </div>
          </button>
          <button 
            onClick={() => router.push('/habits')}
            className="p-3 text-gray-500"
          >
            <div className="flex flex-col items-center space-y-1">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs">Habits</span>
            </div>
          </button>
          <button 
            onClick={() => router.push('/dreams')}
            className="p-3 text-gray-500"
          >
            <div className="flex flex-col items-center space-y-1">
              <Target className="w-5 h-5" />
              <span className="text-xs">Dreams</span>
            </div>
          </button>
          <button 
            onClick={() => router.push('/profile')}
            className="p-3 text-gray-500"
          >
            <div className="flex flex-col items-center space-y-1">
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Bottom Spacing for Navigation */}
      <div className="h-20" />
    </div>
  );
}