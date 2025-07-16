'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Circle, 
  ArrowLeft, 
  Flame, 
  Zap, 
  Trophy, 
  Plus,
  Clock,
  Calendar,
  Target,
  Heart,
  Coffee,
  Book,
  Dumbbell,
  Headphones,
  Sun,
  Moon,
  Droplets,
  Utensils
} from 'lucide-react';

interface QuickHabit {
  id: string;
  title: string;
  icon: any;
  completed: boolean;
  streak: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  color: string;
  category: string;
  targetCount?: number;
  currentCount?: number;
  unit?: string;
}

export default function QuickHabitsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoCompleteId = searchParams.get('complete');
  
  const [habits, setHabits] = useState<QuickHabit[]>([
    // Morning Habits
    {
      id: '1',
      title: 'Drink Water',
      icon: Droplets,
      completed: false,
      streak: 12,
      timeOfDay: 'morning',
      color: 'bg-blue-500',
      category: 'Health',
      targetCount: 8,
      currentCount: 2,
      unit: 'glasses'
    },
    {
      id: '2',
      title: 'Morning Gratitude',
      icon: Sun,
      completed: true,
      streak: 7,
      timeOfDay: 'morning',
      color: 'bg-yellow-500',
      category: 'Mindfulness'
    },
    {
      id: '3',
      title: 'Meditation',
      icon: Headphones,
      completed: false,
      streak: 5,
      timeOfDay: 'morning',
      color: 'bg-purple-500',
      category: 'Mindfulness'
    },
    {
      id: '4',
      title: 'Healthy Breakfast',
      icon: Utensils,
      completed: false,
      streak: 4,
      timeOfDay: 'morning',
      color: 'bg-green-500',
      category: 'Nutrition'
    },
    
    // Afternoon Habits
    {
      id: '5',
      title: 'Exercise',
      icon: Dumbbell,
      completed: false,
      streak: 8,
      timeOfDay: 'afternoon',
      color: 'bg-orange-500',
      category: 'Fitness',
      targetCount: 30,
      currentCount: 0,
      unit: 'minutes'
    },
    {
      id: '6',
      title: 'Read',
      icon: Book,
      completed: false,
      streak: 15,
      timeOfDay: 'afternoon',
      color: 'bg-indigo-500',
      category: 'Learning',
      targetCount: 20,
      currentCount: 5,
      unit: 'pages'
    },
    
    // Evening Habits
    {
      id: '7',
      title: 'Journal',
      icon: Heart,
      completed: false,
      streak: 6,
      timeOfDay: 'evening',
      color: 'bg-pink-500',
      category: 'Reflection'
    },
    {
      id: '8',
      title: 'Plan Tomorrow',
      icon: Calendar,
      completed: false,
      streak: 3,
      timeOfDay: 'evening',
      color: 'bg-teal-500',
      category: 'Planning'
    }
  ]);

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  useEffect(() => {
    // Auto-complete habit if coming from notification
    if (autoCompleteId) {
      const habit = habits.find(h => h.id === autoCompleteId);
      if (habit && !habit.completed) {
        toggleHabit(autoCompleteId);
      }
    }
  }, [autoCompleteId]);

  const toggleHabit = (habitId: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const newCompleted = !habit.completed;
          const newStreak = newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);
          
          // Show celebration for streak milestones
          if (newCompleted && newStreak > 0 && (newStreak % 7 === 0 || newStreak === 1)) {
            showHabitCelebration(habit.title, newStreak);
          }
          
          return {
            ...habit,
            completed: newCompleted,
            streak: newStreak,
            currentCount: newCompleted && habit.targetCount ? habit.targetCount : (habit.currentCount || 0)
          };
        }
        return habit;
      })
    );
  };

  const showHabitCelebration = (habitTitle: string, streak: number) => {
    let message = '';
    
    if (streak === 1) {
      message = `Great start with ${habitTitle}! 🎉`;
    } else if (streak === 7) {
      message = `7-day streak with ${habitTitle}! You're on fire! 🔥`;
    } else if (streak === 30) {
      message = `30-day streak! ${habitTitle} is now a superpower! ⚡`;
    } else if (streak % 7 === 0) {
      message = `${streak}-day streak with ${habitTitle}! Unstoppable! 🚀`;
    }
    
    setCelebrationMessage(message);
    setShowCelebration(true);
    
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const getTimeBasedHabits = () => {
    const hour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning';
    
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17) timeOfDay = 'evening';
    
    const timeHabits = habits.filter(h => h.timeOfDay === timeOfDay);
    const anytimeHabits = habits.filter(h => h.timeOfDay === 'anytime');
    
    return [...timeHabits, ...anytimeHabits];
  };

  const completedToday = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const completionPercentage = Math.round((completedToday / totalHabits) * 100);

  const getTimeOfDayTitle = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { title: 'Morning Habits', icon: Sun, color: 'text-yellow-500' };
    if (hour < 17) return { title: 'Afternoon Habits', icon: Coffee, color: 'text-orange-500' };
    return { title: 'Evening Habits', icon: Moon, color: 'text-blue-500' };
  };

  const timeInfo = getTimeOfDayTitle();
  const TimeIcon = timeInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => router.back()}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <TimeIcon className={`w-5 h-5 ${timeInfo.color}`} />
                <h1 className="text-lg font-semibold text-gray-900">{timeInfo.title}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{completedToday}/{totalHabits}</span>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-green-600">{completionPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-4 py-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {Math.max(...habits.map(h => h.streak))}
            </p>
            <p className="text-xs text-gray-500">Best Streak</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {habits.reduce((sum, h) => sum + h.streak, 0)}
            </p>
            <p className="text-xs text-gray-500">Total Days</p>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="px-4 pb-6 space-y-3">
        {getTimeBasedHabits().map((habit) => {
          const Icon = habit.icon;
          const hasProgress = habit.targetCount && habit.currentCount !== undefined;
          const progressPercentage = hasProgress ? 
            Math.round((habit.currentCount! / habit.targetCount!) * 100) : 0;
          
          return (
            <div
              key={habit.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all duration-200 ${
                habit.completed
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Habit Icon */}
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    habit.completed
                      ? 'bg-green-500'
                      : habit.color + ' hover:scale-105'
                  }`}
                >
                  {habit.completed ? (
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  ) : (
                    <Icon className="w-8 h-8 text-white" />
                  )}
                </button>

                {/* Habit Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{habit.title}</h3>
                    {habit.streak > 0 && (
                      <div className="flex items-center space-x-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-bold text-orange-600">{habit.streak}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{habit.category}</span>
                    {hasProgress && (
                      <span className="text-sm text-blue-600 font-medium">
                        {habit.currentCount}/{habit.targetCount} {habit.unit}
                      </span>
                    )}
                  </div>

                  {/* Progress bar for quantitative habits */}
                  {hasProgress && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick complete button */}
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    habit.completed
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {habit.completed && <CheckCircle2 className="w-5 h-5 text-white" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Habit */}
      <div className="px-4 pb-6">
        <button
          onClick={() => router.push('/habits/new')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl flex items-center justify-center space-x-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Habit</span>
        </button>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Amazing!</h3>
            <p className="text-gray-600">{celebrationMessage}</p>
          </div>
        </div>
      )}

      {/* Bottom spacing for navigation */}
      <div className="h-20" />
    </div>
  );
}