'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Clock, 
  Flame, 
  Target, 
  Calendar,
  Settings,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  Trophy,
  TrendingUp,
  Heart,
  Brain,
  Sparkles,
  Coffee,
  Sunrise,
  Moon,
  Zap,
  Award,
  Star
} from 'lucide-react';
import { notificationService, Ritual, Task } from '@/lib/notifications';

const ritualCategories = {
  meditation: { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Meditation' },
  journaling: { icon: Edit3, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Journaling' },
  exercise: { icon: Zap, color: 'text-green-500', bg: 'bg-green-50', label: 'Exercise' },
  gratitude: { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50', label: 'Gratitude' },
  visualization: { icon: Sparkles, color: 'text-indigo-500', bg: 'bg-indigo-50', label: 'Visualization' },
  affirmations: { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Affirmations' }
};

const timeOfDayLabels = {
  morning: { icon: Sunrise, label: 'Morning', hours: '06:00-12:00' },
  afternoon: { icon: Coffee, label: 'Afternoon', hours: '12:00-18:00' },
  evening: { icon: Moon, label: 'Evening', hours: '18:00-24:00' }
};

export default function RitualsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateRitual, setShowCreateRitual] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string>('all');
  
  // New ritual form state
  const [newRitual, setNewRitual] = useState({
    title: '',
    description: '',
    frequency: 'daily' as const,
    time: '07:00',
    category: 'meditation' as keyof typeof ritualCategories,
    active: true
  });

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as const,
    category: 'personal'
  });

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Load rituals and tasks
    setRituals(notificationService.getRituals());
    setTasks(notificationService.getTasks());
  }, [router]);

  const handleCreateRitual = () => {
    if (!newRitual.title.trim()) return;

    const ritual = notificationService.createRitual(newRitual);
    setRituals([...rituals, ritual]);
    setNewRitual({
      title: '',
      description: '',
      frequency: 'daily',
      time: '07:00',
      category: 'meditation',
      active: true
    });
    setShowCreateRitual(false);
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;

    const task = notificationService.createTask({
      ...newTask,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined
    });
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: 'personal'
    });
    setShowCreateTask(false);
  };

  const handleCompleteRitual = (ritualId: string) => {
    notificationService.completeRitual(ritualId);
    setRituals(notificationService.getRituals());
  };

  const handleCompleteTask = (taskId: string) => {
    notificationService.completeTask(taskId);
    setTasks(notificationService.getTasks());
  };

  const handleDeleteRitual = (ritualId: string) => {
    notificationService.deleteRitual(ritualId);
    setRituals(notificationService.getRituals());
  };

  const handleDeleteTask = (taskId: string) => {
    notificationService.deleteTask(taskId);
    setTasks(notificationService.getTasks());
  };

  const getTimeOfDay = (time: string): string => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const filteredRituals = selectedTimeOfDay === 'all' 
    ? rituals.filter(r => r.active)
    : rituals.filter(r => r.active && getTimeOfDay(r.time) === selectedTimeOfDay);

  const pendingTasks = tasks.filter(t => !t.completed);
  const overdueTasks = notificationService.getOverdueTasks();
  const stats = notificationService.getRitualStats();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 manifestation-gradient rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your rituals...</p>
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
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-bold text-foreground">Daily Rituals & Tasks</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateTask(true)}
                className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
              <button
                onClick={() => setShowCreateRitual(true)}
                className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Ritual</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Rituals</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalRituals}</p>
                </div>
                <Brain className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Longest Streak</p>
                  <p className="text-2xl font-bold text-foreground">{stats.longestStreak} days</p>
                </div>
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold text-foreground">{pendingTasks.length}</p>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Streak</p>
                  <p className="text-2xl font-bold text-foreground">{stats.averageStreak} days</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Time Filter */}
          <div className="lg:col-span-3">
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setSelectedTimeOfDay('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedTimeOfDay === 'all' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                All Day
              </button>
              {Object.entries(timeOfDayLabels).map(([time, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTimeOfDay(time)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedTimeOfDay === time 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rituals Section */}
          <div className="lg:col-span-2">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                Daily Rituals
              </h2>
              
              <div className="space-y-4">
                {filteredRituals.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No rituals for this time period.</p>
                    <button
                      onClick={() => setShowCreateRitual(true)}
                      className="mt-2 text-primary hover:underline"
                    >
                      Create your first ritual
                    </button>
                  </div>
                ) : (
                  filteredRituals.map((ritual) => {
                    const category = ritualCategories[ritual.category];
                    const CategoryIcon = category.icon;
                    const isCompletedToday = ritual.lastCompleted && 
                      new Date(ritual.lastCompleted).toDateString() === new Date().toDateString();
                    
                    return (
                      <div key={ritual.id} className="border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleCompleteRitual(ritual.id)}
                              disabled={isCompletedToday}
                              className={`transition-colors ${
                                isCompletedToday 
                                  ? 'text-green-500' 
                                  : 'text-muted-foreground hover:text-green-500'
                              }`}
                            >
                              {isCompletedToday ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </button>
                            
                            <div className={`p-2 rounded-lg ${category.bg}`}>
                              <CategoryIcon className={`w-4 h-4 ${category.color}`} />
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{ritual.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {ritual.time}
                                </span>
                                <span className="flex items-center">
                                  <Flame className="w-3 h-3 mr-1" />
                                  {ritual.streak} day streak
                                </span>
                                <span className="capitalize">{ritual.frequency}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleDeleteRitual(ritual.id)}
                              className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                              title="Delete ritual"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {ritual.description && (
                          <p className="text-sm text-muted-foreground mt-2 pl-9">{ritual.description}</p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="lg:col-span-1">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Tasks
              </h2>
              
              {/* Overdue Tasks */}
              {overdueTasks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-red-500 mb-3 flex items-center">
                    <Circle className="w-3 h-3 mr-1" />
                    Overdue ({overdueTasks.length})
                  </h3>
                  <div className="space-y-2">
                    {overdueTasks.map((task) => (
                      <div key={task.id} className="border border-red-200 bg-red-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleCompleteTask(task.id)}
                              className="text-muted-foreground hover:text-green-500 transition-colors"
                            >
                              <Circle className="w-4 h-4" />
                            </button>
                            <div className="flex-1">
                              <h4 className="font-medium text-red-700">{task.title}</h4>
                              <p className="text-xs text-red-600">
                                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Pending Tasks */}
              <div className="space-y-3">
                {pendingTasks.filter(t => !overdueTasks.includes(t)).length === 0 ? (
                  <div className="text-center py-6">
                    <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">All caught up!</p>
                  </div>
                ) : (
                  pendingTasks.filter(t => !overdueTasks.includes(t)).map((task) => (
                    <div key={task.id} className="border border-border rounded-lg p-3 hover:border-primary/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className="text-muted-foreground hover:text-green-500 transition-colors"
                          >
                            <Circle className="w-4 h-4" />
                          </button>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{task.title}</h4>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span className={`px-2 py-1 rounded ${
                                task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {task.priority}
                              </span>
                              {task.dueDate && (
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Ritual Modal */}
      {showCreateRitual && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">Create New Ritual</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                <input
                  type="text"
                  value={newRitual.title}
                  onChange={(e) => setNewRitual({ ...newRitual, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Morning meditation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={newRitual.description}
                  onChange={(e) => setNewRitual({ ...newRitual, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={2}
                  placeholder="10 minutes of mindfulness meditation"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    value={newRitual.category}
                    onChange={(e) => setNewRitual({ ...newRitual, category: e.target.value as keyof typeof ritualCategories })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {Object.entries(ritualCategories).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Time</label>
                  <input
                    type="time"
                    value={newRitual.time}
                    onChange={(e) => setNewRitual({ ...newRitual, time: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Frequency</label>
                <select
                  value={newRitual.frequency}
                  onChange={(e) => setNewRitual({ ...newRitual, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateRitual(false)}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRitual}
                disabled={!newRitual.title.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Create Ritual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-foreground mb-4">Create New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Complete project proposal"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={2}
                  placeholder="Finish the research and write the proposal"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <input
                  type="text"
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Work, Personal, Health, etc."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateTask(false)}
                className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-secondary/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!newTask.title.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}