'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { taskManager, Task, TaskStats } from '@/lib/taskManager';
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
  Moon,
  Mic,
  Keyboard
} from 'lucide-react';

export default function TodaysFocus() {
  const { user } = useUser();
  const router = useRouter();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks and stats on component mount
  useEffect(() => {
    loadTasksAndStats();
  }, []);

  const loadTasksAndStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allTasks, taskStats] = await Promise.all([
        taskManager.getAllTasks(),
        taskManager.getTaskStats()
      ]);
      
      setTasks(allTasks);
      setStats(taskStats);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      // Update task completion status
      const updatedTask = await taskManager.updateTask(taskId, {
        completed: !task.completed
      });
      
      if (updatedTask) {
        // Update local state
        setTasks(prev => prev.map(t => 
          t.id === taskId ? updatedTask : t
        ));
        
        // Refresh stats
        const newStats = await taskManager.getTaskStats();
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const addQuickTask = async () => {
    if (!newTaskText.trim()) return;
    
    try {
      const newTask = await taskManager.createTask({
        title: newTaskText.trim(),
        category: 'daily',
        priority: 'medium',
        timeEstimate: '5 min',
        tags: []
      });
      
      // Update local state
      setTasks(prev => [...prev, newTask]);
      
      // Refresh stats
      const newStats = await taskManager.getTaskStats();
      setStats(newStats);
      
      setNewTaskText('');
      setShowQuickAdd(false);
      
      // Haptic feedback for successful add
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewTaskText(transcript);
      };
      
      recognition.start();
    } else {
      alert('Voice input not supported in this browser');
    }
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
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const completionRate = stats ? Math.round((stats.todayCompleted / Math.max(stats.todayTotal, 1)) * 100) : 0;
  const streakDays = stats?.streakDays || 0;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-6">
          <div className="h-6 bg-secondary/50 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-secondary/30 rounded w-1/3"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card/50 rounded-xl p-4">
              <div className="h-4 bg-secondary/50 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadTasksAndStats}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            <span className="text-lg font-bold text-foreground">{streakDays}</span>
          </div>
        </div>

        {/* Quick Progress */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Today's Progress</span>
          <span className="font-semibold text-foreground">
            {stats?.todayCompleted || 0}/{stats?.todayTotal || 0} completed
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
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-foreground mb-3 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
            Completed Today ({completedTasks.length})
          </h3>
          <div className="space-y-2">
            {completedTasks.map((task) => (
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
          onClick={() => setShowQuickAdd(true)}
          className="bg-primary text-primary-foreground p-4 rounded-xl hover:bg-primary/90 transition-colors active:scale-95"
        >
          <Plus className="w-6 h-6 mx-auto mb-2" />
          <span className="text-sm font-semibold">Quick Add</span>
        </button>
        
        <button 
          onClick={() => router.push('/coach')}
          className="bg-purple-500 text-white p-4 rounded-xl hover:bg-purple-600 transition-colors active:scale-95"
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
        <p className="text-xs text-muted-foreground mt-1">
          {completionRate > 0 ? `You're ${completionRate}% there today!` : 'Ready to start your day?'}
        </p>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
          <div className="bg-card w-full max-w-md rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Quick Add Task</h3>
              <button 
                onClick={() => setShowQuickAdd(false)}
                className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addQuickTask()}
                  placeholder="What do you want to accomplish?"
                  className="w-full p-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={startVoiceInput}
                  disabled={isListening}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-border transition-colors ${
                    isListening 
                      ? 'bg-red-100 text-red-600 border-red-300' 
                      : 'bg-background hover:bg-secondary/50'
                  }`}
                >
                  <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-medium">
                    {isListening ? 'Listening...' : 'Voice'}
                  </span>
                </button>
                
                <button
                  onClick={addQuickTask}
                  disabled={!newTaskText.trim()}
                  className="flex-1 bg-primary text-primary-foreground p-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Task</span>
                </button>
              </div>
              
              {/* Quick Templates */}
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-2">Quick templates:</p>
                <div className="flex flex-wrap gap-2">
                  {taskManager.getQuickTemplates().slice(0, 4).map((template) => (
                    <button
                      key={template.title}
                      onClick={() => setNewTaskText(template.title)}
                      className="px-3 py-1 text-xs bg-secondary/50 hover:bg-secondary/80 rounded-full transition-colors"
                    >
                      {template.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}