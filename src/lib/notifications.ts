// Email Notification Service for ManifestAI
// Handles sending email reminders for tasks, rituals, and goal tracking

export interface NotificationData {
  id: string;
  userId: string;
  email: string;
  type: 'daily_ritual' | 'task_reminder' | 'goal_check_in' | 'achievement_celebration';
  title: string;
  message: string;
  scheduledFor: Date;
  sent: boolean;
  createdAt: Date;
}

export interface Ritual {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:MM format
  category: 'meditation' | 'journaling' | 'exercise' | 'gratitude' | 'visualization' | 'affirmations';
  active: boolean;
  streak: number;
  lastCompleted?: Date;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  dreamId?: string;
  createdAt: Date;
}

class NotificationService {
  private notifications: NotificationData[] = [];
  private rituals: Ritual[] = [];
  private tasks: Task[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // Load data from localStorage
  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const notificationsData = localStorage.getItem('manifestai_notifications');
      const ritualsData = localStorage.getItem('manifestai_rituals');
      const tasksData = localStorage.getItem('manifestai_tasks');

      if (notificationsData) {
        this.notifications = JSON.parse(notificationsData);
      }
      if (ritualsData) {
        this.rituals = JSON.parse(ritualsData);
      }
      if (tasksData) {
        this.tasks = JSON.parse(tasksData);
      }
    }
  }

  // Save data to localStorage
  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('manifestai_notifications', JSON.stringify(this.notifications));
      localStorage.setItem('manifestai_rituals', JSON.stringify(this.rituals));
      localStorage.setItem('manifestai_tasks', JSON.stringify(this.tasks));
    }
  }

  // Create a new ritual
  createRitual(ritual: Omit<Ritual, 'id' | 'streak' | 'createdAt'>): Ritual {
    const newRitual: Ritual = {
      ...ritual,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      streak: 0,
      createdAt: new Date()
    };

    this.rituals.push(newRitual);
    this.saveToStorage();
    this.scheduleRitualReminders(newRitual);
    
    return newRitual;
  }

  // Create a new task
  createTask(task: Omit<Task, 'id' | 'completed' | 'createdAt'>): Task {
    const newTask: Task = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      completed: false,
      createdAt: new Date()
    };

    this.tasks.push(newTask);
    this.saveToStorage();
    this.scheduleTaskReminders(newTask);
    
    return newTask;
  }

  // Complete a ritual and update streak
  completeRitual(ritualId: string): void {
    const ritual = this.rituals.find(r => r.id === ritualId);
    if (ritual) {
      const today = new Date();
      const lastCompleted = ritual.lastCompleted ? new Date(ritual.lastCompleted) : null;
      
      // Check if it's a new day to increment streak
      if (!lastCompleted || this.isNewDay(lastCompleted, today)) {
        ritual.streak += 1;
        ritual.lastCompleted = today;
        
        // Send celebration notification for milestones
        if (ritual.streak % 7 === 0) { // Weekly milestone
          this.scheduleNotification({
            userId: 'current_user', // Replace with actual user ID
            email: 'user@example.com', // Replace with actual user email
            type: 'achievement_celebration',
            title: `🎉 ${ritual.streak} Day Streak!`,
            message: `Congratulations! You've maintained your ${ritual.title} ritual for ${ritual.streak} days straight. You're building powerful habits!`,
            scheduledFor: new Date()
          });
        }
      }
      
      this.saveToStorage();
    }
  }

  // Complete a task
  completeTask(taskId: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = true;
      this.saveToStorage();
      
      // Send achievement notification
      this.scheduleNotification({
        userId: 'current_user',
        email: 'user@example.com',
        type: 'achievement_celebration',
        title: 'Task Completed! 🎯',
        message: `Great job completing "${task.title}"! You're making progress towards your dreams.`,
        scheduledFor: new Date()
      });
    }
  }

  // Schedule ritual reminders
  private scheduleRitualReminders(ritual: Ritual): void {
    if (!ritual.active) return;

    const user = this.getCurrentUser();
    if (!user?.email) return;

    // Schedule daily reminder
    const reminderTime = new Date();
    const [hours, minutes] = ritual.time.split(':');
    reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (reminderTime <= new Date()) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    this.scheduleNotification({
      userId: user.id,
      email: user.email,
      type: 'daily_ritual',
      title: `Time for your ${ritual.title} ritual`,
      message: `It's time to practice your ${ritual.title}! Current streak: ${ritual.streak} days. Keep the momentum going!`,
      scheduledFor: reminderTime
    });
  }

  // Schedule task reminders
  private scheduleTaskReminders(task: Task): void {
    if (!task.dueDate || task.completed) return;

    const user = this.getCurrentUser();
    if (!user?.email) return;

    // Schedule reminder 1 day before due date
    const reminderDate = new Date(task.dueDate);
    reminderDate.setDate(reminderDate.getDate() - 1);
    reminderDate.setHours(9, 0, 0, 0); // 9 AM reminder

    if (reminderDate > new Date()) {
      this.scheduleNotification({
        userId: user.id,
        email: user.email,
        type: 'task_reminder',
        title: `Task Due Tomorrow: ${task.title}`,
        message: `Don't forget about "${task.title}" - it's due tomorrow! Stay on track with your goals.`,
        scheduledFor: reminderDate
      });
    }

    // Schedule reminder on due date
    const dueDateReminder = new Date(task.dueDate);
    dueDateReminder.setHours(9, 0, 0, 0);

    if (dueDateReminder > new Date()) {
      this.scheduleNotification({
        userId: user.id,
        email: user.email,
        type: 'task_reminder',
        title: `Task Due Today: ${task.title}`,
        message: `"${task.title}" is due today! Take action and make progress towards your dreams.`,
        scheduledFor: dueDateReminder
      });
    }
  }

  // Schedule a notification
  private scheduleNotification(notificationData: Omit<NotificationData, 'id' | 'sent' | 'createdAt'>): void {
    const notification: NotificationData = {
      ...notificationData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      sent: false,
      createdAt: new Date()
    };

    this.notifications.push(notification);
    this.saveToStorage();

    // In a real app, this would trigger an actual email service
    console.log('📧 Email notification scheduled:', notification);
  }

  // Mock email sending (in production this would use a real email service)
  async sendEmail(notification: NotificationData): Promise<boolean> {
    try {
      // Simulate email sending
      console.log('📧 Sending email:', {
        to: notification.email,
        subject: notification.title,
        body: notification.message
      });

      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mark as sent
      notification.sent = true;
      this.saveToStorage();

      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Process pending notifications (would be called by a cron job or similar)
  async processPendingNotifications(): Promise<void> {
    const now = new Date();
    const pendingNotifications = this.notifications.filter(
      n => !n.sent && new Date(n.scheduledFor) <= now
    );

    for (const notification of pendingNotifications) {
      await this.sendEmail(notification);
    }
  }

  // Get current user (mock implementation)
  private getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // Check if two dates are on different days
  private isNewDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() !== date2.toDateString();
  }

  // Get all rituals
  getRituals(): Ritual[] {
    return this.rituals;
  }

  // Get all tasks
  getTasks(): Task[] {
    return this.tasks;
  }

  // Get pending tasks
  getPendingTasks(): Task[] {
    return this.tasks.filter(task => !task.completed);
  }

  // Get overdue tasks
  getOverdueTasks(): Task[] {
    const now = new Date();
    return this.tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    );
  }

  // Get today's rituals
  getTodaysRituals(): Ritual[] {
    return this.rituals.filter(ritual => ritual.active);
  }

  // Get ritual stats
  getRitualStats() {
    const activeRituals = this.rituals.filter(r => r.active);
    const totalStreak = activeRituals.reduce((sum, r) => sum + r.streak, 0);
    const avgStreak = activeRituals.length > 0 ? totalStreak / activeRituals.length : 0;
    const longestStreak = Math.max(...activeRituals.map(r => r.streak), 0);

    return {
      totalRituals: activeRituals.length,
      totalStreak,
      averageStreak: Math.round(avgStreak),
      longestStreak
    };
  }

  // Delete ritual
  deleteRitual(ritualId: string): void {
    this.rituals = this.rituals.filter(r => r.id !== ritualId);
    this.saveToStorage();
  }

  // Delete task
  deleteTask(taskId: string): void {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveToStorage();
  }

  // Update ritual
  updateRitual(ritualId: string, updates: Partial<Ritual>): void {
    const ritual = this.rituals.find(r => r.id === ritualId);
    if (ritual) {
      Object.assign(ritual, updates);
      this.saveToStorage();
      
      if (updates.active !== false) {
        this.scheduleRitualReminders(ritual);
      }
    }
  }

  // Update task
  updateTask(taskId: string, updates: Partial<Task>): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      Object.assign(task, updates);
      this.saveToStorage();
      
      if (!updates.completed) {
        this.scheduleTaskReminders(task);
      }
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export types for use in components
export type { NotificationData, Ritual, Task };