'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Target,
  Clock,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Zap,
  Coffee,
  Sunset,
  Moon
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: 'habit' | 'dream' | 'daily';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  timeEstimate?: string;
}

interface TodayData {
  tasks: Task[];
  streak: number;
  completedToday: number;
  totalToday: number;
}

export default function TodaysFocus() {
  const { user } = useUser();
  const router = useRouter();
  const [todayData, setTodayData] = useState<TodayData>({
    tasks: [
      {
        id: '1',
        title: 'Review 3 goals for the week',
        category: 'dream',
        completed: false,
        priority: 'high',
        timeEstimate: '5 min'
      },
      {
        id: '2', 
        title: 'Take 5 deep breaths',
        category: 'habit',
        completed: true,
        priority: 'medium',
        timeEstimate: '2 min'
      },
      {
        id: '3',
        title: 'Send one important email',
        category: 'daily',
        completed: false,
        priority: 'high',
        timeEstimate: '10 min'
      },
      {
        id: '4',
        title: 'Write 3 things I\'m grateful for',
        category: 'habit',
        completed: false,
        priority: 'medium',
        timeEstimate: '3 min'
      }
    ],
    streak: 7,
    completedToday: 1,
    totalToday: 4
  });

  const toggleTask = (taskId: string) => {
    setTodayData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      ),
      completedToday: prev.tasks.filter(t => 
        t.id === taskId ? !t.completed : t.completed
      ).length
    }));
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        greeting: "Good morning",
        message: "Let's make today count! ☀️",
        icon: Coffee,
        color: "text-orange-500"
      };
    } else if (hour < 17) {
      return {
        greeting: "Good afternoon", 
        message: "Keep the momentum going! 🚀",
        icon: Zap,
        color: "text-blue-500"
      };
    } else {
      return {
        greeting: "Good evening",
        message: "Finish strong today! 🌟",
        icon: Sunset,
        color: "text-purple-500"
      };
    }
  };

  const timeContext = getTimeBasedGreeting();
  const pendingTasks = todayData.tasks.filter(t => !t.completed);
  const completionRate = Math.round((todayData.completedToday / todayData.totalToday) * 100);

  return (
    <div className="space-y-6">
      {/* Header with Time-based Greeting */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <timeContext.icon className={`w-6 h-6 ${timeContext.color}`} />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {timeContext.greeting}, {user?.firstName}!
              </h1>
              <p className="text-sm text-muted-foreground">{timeContext.message}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-bold text-foreground">{todayData.streak}</span>
          </div>
        </div>

        {/* Quick Progress */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Today's Progress</span>
          <span className="font-semibold text-foreground">
            {todayData.completedToday}/{todayData.totalToday} completed
          </span>
        </div>
        <div className="w-full bg-secondary/50 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Pending Tasks - Priority Section */}
      {pendingTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Focus Now ({pendingTasks.length} pending)
            </h2>
            <button className="text-sm text-primary hover:underline">
              Add Task
            </button>
          </div>

          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 hover:bg-card/80 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <Circle className="w-6 h-6" />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">{task.title}</h3>
                      <div className="flex items-center space-x-2">
                        {task.priority === 'high' && (
                          <span className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                        {task.timeEstimate && (
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {task.timeEstimate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.category === 'habit' 
                          ? 'bg-green-100 text-green-700' 
                          : task.category === 'dream'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {todayData.completedToday > 0 && (
        <div>
          <h3 className="text-md font-semibold text-foreground mb-3 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            Completed Today ({todayData.completedToday})
          </h3>
          <div className="space-y-2">
            {todayData.tasks.filter(t => t.completed).map((task) => (
              <div
                key={task.id}
                className="bg-green-50 border border-green-200 rounded-lg p-3 opacity-75"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-foreground line-through">{task.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions for Busy Professionals */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => router.push('/dreams/new')}
          className="bg-primary text-primary-foreground p-4 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm font-semibold">Quick Add</span>
        </button>
        
        <button 
          onClick={() => router.push('/coach')}
          className="bg-purple-500 text-white p-4 rounded-xl hover:bg-purple-600 transition-colors"
        >
          <MessageCircle className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm font-semibold">AI Coach</span>
        </button>
      </div>

      {/* Motivational Quote or Insight */}
      <div className="bg-gradient-to-r from-secondary/20 to-primary/10 rounded-xl p-4 text-center">
        <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
        <p className="text-sm text-foreground font-medium">
          "Small daily improvements lead to stunning long-term results."
        </p>
        <p className="text-xs text-muted-foreground mt-1">You're {completionRate}% there today!</p>
      </div>
    </div>
  );
}