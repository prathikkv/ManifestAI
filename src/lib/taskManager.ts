// Task Management Service with Offline-First Architecture

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'habit' | 'dream' | 'daily';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  timeEstimate?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  dueDate?: string | null;
  streak: number;
  tags: string[];
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  streakDays: number;
  completionRate: number;
  todayCompleted: number;
  todayTotal: number;
}

export interface HabitCompletion {
  taskId: string;
  date: string;
  completed: boolean;
}

class TaskManager {
  private storageKey = 'manifestai_tasks';
  private statsKey = 'manifestai_stats';
  private completionsKey = 'manifestai_completions';
  private isOnline = navigator.onLine;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncWithServer();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Local Storage Operations
  private getLocalTasks(): Task[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading local tasks:', error);
      return [];
    }
  }

  private saveLocalTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving local tasks:', error);
    }
  }

  private getLocalCompletions(): HabitCompletion[] {
    try {
      const stored = localStorage.getItem(this.completionsKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading local completions:', error);
      return [];
    }
  }

  private saveLocalCompletions(completions: HabitCompletion[]): void {
    try {
      localStorage.setItem(this.completionsKey, JSON.stringify(completions));
    } catch (error) {
      console.error('Error saving local completions:', error);
    }
  }

  // CRUD Operations (Offline-First)
  async getAllTasks(): Promise<Task[]> {
    const localTasks = this.getLocalTasks();
    
    // If online, try to fetch from server and merge
    if (this.isOnline) {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Merge server tasks with local tasks (server takes precedence)
            const mergedTasks = this.mergeTasks(localTasks, data.tasks);
            this.saveLocalTasks(mergedTasks);
            return mergedTasks;
          }
        }
      } catch (error) {
        console.error('Error fetching tasks from server:', error);
      }
    }
    
    return localTasks;
  }

  async createTask(taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed' | 'streak'>): Promise<Task> {
    const newTask: Task = {
      id: Date.now().toString(),
      userId: 'local-user',
      completed: false,
      streak: 0,
      createdAt: new Date().toISOString(),
      ...taskData
    };

    // Save locally first
    const localTasks = this.getLocalTasks();
    localTasks.push(newTask);
    this.saveLocalTasks(localTasks);

    // Try to sync with server if online
    if (this.isOnline) {
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Update local task with server response
            const updatedTasks = localTasks.map(task => 
              task.id === newTask.id ? { ...task, ...data.task } : task
            );
            this.saveLocalTasks(updatedTasks);
            return { ...newTask, ...data.task };
          }
        }
      } catch (error) {
        console.error('Error creating task on server:', error);
      }
    }

    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const localTasks = this.getLocalTasks();
    const taskIndex = localTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return null;
    }

    // Update locally first
    const updatedTask = {
      ...localTasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Handle completion logic
    if (updates.completed === true && !localTasks[taskIndex].completed) {
      updatedTask.completedAt = new Date().toISOString();
      
      // Handle streak for habits
      if (updatedTask.category === 'habit') {
        this.recordHabitCompletion(id, new Date().toISOString().split('T')[0]);
        updatedTask.streak = this.calculateStreak(id);
      }
    }

    localTasks[taskIndex] = updatedTask;
    this.saveLocalTasks(localTasks);

    // Try to sync with server if online
    if (this.isOnline) {
      try {
        const response = await fetch('/api/tasks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...updates })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            localTasks[taskIndex] = { ...updatedTask, ...data.task };
            this.saveLocalTasks(localTasks);
            return localTasks[taskIndex];
          }
        }
      } catch (error) {
        console.error('Error updating task on server:', error);
      }
    }

    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const localTasks = this.getLocalTasks();
    const taskIndex = localTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return false;
    }

    // Remove locally first
    localTasks.splice(taskIndex, 1);
    this.saveLocalTasks(localTasks);

    // Try to sync with server if online
    if (this.isOnline) {
      try {
        const response = await fetch(`/api/tasks?id=${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          console.error('Error deleting task on server');
        }
      } catch (error) {
        console.error('Error deleting task on server:', error);
      }
    }

    return true;
  }

  // Habit Tracking
  private recordHabitCompletion(taskId: string, date: string): void {
    const completions = this.getLocalCompletions();
    const existingIndex = completions.findIndex(c => c.taskId === taskId && c.date === date);
    
    if (existingIndex === -1) {
      completions.push({ taskId, date, completed: true });
      this.saveLocalCompletions(completions);
    }
  }

  private calculateStreak(taskId: string): number {
    const completions = this.getLocalCompletions()
      .filter(c => c.taskId === taskId && c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (completions.length === 0) return 0;

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = today;

    for (const completion of completions) {
      if (completion.date === currentDate) {
        streak++;
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        currentDate = prevDate.toISOString().split('T')[0];
      } else {
        break;
      }
    }

    return streak;
  }

  // Analytics
  async getTaskStats(): Promise<TaskStats> {
    const tasks = await this.getAllTasks();
    const today = new Date().toISOString().split('T')[0];
    
    const todayTasks = tasks.filter(task => 
      task.createdAt.startsWith(today) || 
      (task.dueDate && task.dueDate.startsWith(today))
    );

    const completed = tasks.filter(task => task.completed);
    const pending = tasks.filter(task => !task.completed);
    
    // Calculate longest current streak
    const habitTasks = tasks.filter(task => task.category === 'habit');
    const maxStreak = habitTasks.reduce((max, task) => Math.max(max, task.streak), 0);

    return {
      total: tasks.length,
      completed: completed.length,
      pending: pending.length,
      streakDays: maxStreak,
      completionRate: tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0,
      todayCompleted: todayTasks.filter(task => task.completed).length,
      todayTotal: todayTasks.length
    };
  }

  // Utility Methods
  private mergeTasks(localTasks: Task[], serverTasks: Task[]): Task[] {
    const merged = [...serverTasks];
    
    // Add local-only tasks that aren't on server
    localTasks.forEach(localTask => {
      if (!serverTasks.find(serverTask => serverTask.id === localTask.id)) {
        merged.push(localTask);
      }
    });

    return merged;
  }

  private async syncWithServer(): Promise<void> {
    try {
      const localTasks = this.getLocalTasks();
      const response = await fetch('/api/tasks');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const mergedTasks = this.mergeTasks(localTasks, data.tasks);
          this.saveLocalTasks(mergedTasks);
        }
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  }

  // Quick task templates for busy professionals
  getQuickTemplates(): Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed' | 'streak'>[] {
    return [
      {
        title: 'Meditate for 5 minutes',
        category: 'habit',
        priority: 'medium',
        timeEstimate: '5 min',
        tags: ['mindfulness', 'wellness']
      },
      {
        title: 'Call mom/dad',
        category: 'daily',
        priority: 'medium',
        timeEstimate: '10 min',
        tags: ['family', 'relationships']
      },
      {
        title: 'Review weekly goals',
        category: 'dream',
        priority: 'high',
        timeEstimate: '15 min',
        tags: ['goals', 'planning']
      },
      {
        title: 'Take a 10-minute walk',
        category: 'habit',
        priority: 'medium',
        timeEstimate: '10 min',
        tags: ['exercise', 'wellness']
      },
      {
        title: 'Write 3 things I\'m grateful for',
        category: 'habit',
        priority: 'low',
        timeEstimate: '3 min',
        tags: ['gratitude', 'mindfulness']
      },
      {
        title: 'Send one important email',
        category: 'daily',
        priority: 'high',
        timeEstimate: '10 min',
        tags: ['communication', 'work']
      }
    ];
  }
}

// Export singleton instance
export const taskManager = new TaskManager();