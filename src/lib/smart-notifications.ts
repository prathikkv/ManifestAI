// Smart Notification System for ManifestAI
// Learns user patterns and sends notifications at optimal times

interface UserBehaviorPattern {
  userId: string;
  morningActiveTime?: number; // Hour of day (0-23)
  afternoonActiveTime?: number;
  eveningActiveTime?: number;
  preferredNotificationGap: number; // Minutes between notifications
  responsiveTimeRanges: { start: number; end: number }[]; // Most responsive hours
  habitCompletionPatterns: { [habitId: string]: number[] }; // Hours when habit is usually completed
  timezone: string;
  phone?: string;
  notificationPreferences: {
    whatsapp: boolean;
    sms: boolean;
    push: boolean;
    email: boolean;
  };
}

interface SmartNotification {
  id: string;
  userId: string;
  type: 'habit_reminder' | 'motivation' | 'celebration' | 'reflection' | 'weekly_summary';
  scheduledFor: Date;
  data: any;
  channel: 'whatsapp' | 'sms' | 'push' | 'email';
  priority: 'high' | 'medium' | 'low';
  sent: boolean;
  responded: boolean;
  responseTime?: number; // Minutes to respond
}

class SmartNotificationEngine {
  private patterns: Map<string, UserBehaviorPattern> = new Map();
  
  // Learn from user behavior to optimize timing
  async learnFromUserBehavior(userId: string, action: string, timestamp: Date): Promise<void> {
    const pattern = this.patterns.get(userId) || this.createDefaultPattern(userId);
    const hour = timestamp.getHours();
    
    switch (action) {
      case 'habit_completed':
        this.updateHabitCompletionPattern(pattern, hour);
        break;
      case 'app_opened':
        this.updateActiveTimePattern(pattern, hour);
        break;
      case 'notification_responded':
        this.updateResponsePattern(pattern, hour);
        break;
    }
    
    this.patterns.set(userId, pattern);
    await this.savePattern(pattern);
  }
  
  // Get optimal notification time for a user
  getOptimalNotificationTime(userId: string, notificationType: string, baseHour?: number): Date {
    const pattern = this.patterns.get(userId);
    if (!pattern) {
      return this.getDefaultNotificationTime(notificationType, baseHour);
    }
    
    let optimalHour = baseHour || 9; // Default fallback
    
    switch (notificationType) {
      case 'morning_motivation':
        optimalHour = pattern.morningActiveTime || 7;
        break;
      case 'habit_reminder':
        optimalHour = this.getOptimalHabitReminderTime(pattern);
        break;
      case 'evening_reflection':
        optimalHour = pattern.eveningActiveTime || 21;
        break;
      case 'weekly_summary':
        optimalHour = pattern.morningActiveTime || 10;
        break;
    }
    
    // Find next available slot that respects user's responsive times
    const adjustedHour = this.adjustForResponsiveTime(pattern, optimalHour);
    
    const scheduledTime = new Date();
    scheduledTime.setHours(adjustedHour, 0, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    return scheduledTime;
  }
  
  // Schedule smart notifications for a user
  async scheduleSmartNotifications(userId: string): Promise<SmartNotification[]> {
    const notifications: SmartNotification[] = [];
    const pattern = this.patterns.get(userId);
    
    if (!pattern) {
      console.log(`⚠️ No behavior pattern found for user ${userId}, using defaults`);
      return [];
    }
    
    // Morning motivation
    if (pattern.notificationPreferences.whatsapp) {
      const morningMotivation: SmartNotification = {
        id: `${userId}_morning_${Date.now()}`,
        userId,
        type: 'motivation',
        scheduledFor: this.getOptimalNotificationTime(userId, 'morning_motivation'),
        data: { affirmation: await this.generatePersonalizedAffirmation(userId) },
        channel: 'whatsapp',
        priority: 'medium',
        sent: false,
        responded: false
      };
      notifications.push(morningMotivation);
    }
    
    // Habit reminders throughout the day
    const habitReminders = await this.generateHabitReminders(userId);
    notifications.push(...habitReminders);
    
    // Evening reflection
    if (pattern.notificationPreferences.whatsapp) {
      const eveningReflection: SmartNotification = {
        id: `${userId}_evening_${Date.now()}`,
        userId,
        type: 'reflection',
        scheduledFor: this.getOptimalNotificationTime(userId, 'evening_reflection'),
        data: { promptType: 'daily_review' },
        channel: 'whatsapp',
        priority: 'low',
        sent: false,
        responded: false
      };
      notifications.push(eveningReflection);
    }
    
    return notifications;
  }
  
  // Generate habit reminders based on user patterns
  private async generateHabitReminders(userId: string): Promise<SmartNotification[]> {
    const reminders: SmartNotification[] = [];
    const pattern = this.patterns.get(userId);
    
    if (!pattern) return reminders;
    
    // Get user's active habits
    const userHabits = await this.getUserHabits(userId);
    
    for (const habit of userHabits) {
      // Skip if habit is already completed today
      if (await this.isHabitCompletedToday(habit.id)) continue;
      
      // Get optimal time for this specific habit
      const optimalTime = this.getOptimalHabitTime(pattern, habit);
      
      const reminder: SmartNotification = {
        id: `${userId}_habit_${habit.id}_${Date.now()}`,
        userId,
        type: 'habit_reminder',
        scheduledFor: optimalTime,
        data: {
          habitId: habit.id,
          habitName: habit.name,
          streakCount: habit.currentStreak
        },
        channel: pattern.notificationPreferences.whatsapp ? 'whatsapp' : 'push',
        priority: this.getHabitPriority(habit),
        sent: false,
        responded: false
      };
      
      reminders.push(reminder);
    }
    
    return reminders;
  }
  
  // Context-aware notification content
  async generateContextualContent(notification: SmartNotification): Promise<any> {
    const { type, userId, data } = notification;
    const pattern = this.patterns.get(userId);
    const hour = new Date().getHours();
    
    switch (type) {
      case 'motivation':
        return this.generateTimeBasedMotivation(hour, pattern);
        
      case 'habit_reminder':
        return this.generateHabitReminderContent(data.habitName, data.streakCount, hour);
        
      case 'celebration':
        return this.generateCelebrationContent(data.achievement, data.streakCount);
        
      case 'reflection':
        return this.generateReflectionPrompt(userId, hour);
        
      default:
        return data;
    }
  }
  
  // Adaptive notification frequency based on user engagement
  adjustNotificationFrequency(userId: string, engagementScore: number): void {
    const pattern = this.patterns.get(userId);
    if (!pattern) return;
    
    if (engagementScore > 0.8) {
      // High engagement: can send more notifications
      pattern.preferredNotificationGap = Math.max(60, pattern.preferredNotificationGap - 15);
    } else if (engagementScore < 0.3) {
      // Low engagement: reduce frequency
      pattern.preferredNotificationGap = Math.min(240, pattern.preferredNotificationGap + 30);
    }
    
    this.patterns.set(userId, pattern);
  }
  
  // Handle notification responses to improve timing
  async recordNotificationResponse(notificationId: string, responseTime: number, successful: boolean): Promise<void> {
    // Update notification record
    // This would typically update a database
    
    // Learn from response timing
    const notification = await this.getNotificationById(notificationId);
    if (notification) {
      await this.learnFromUserBehavior(
        notification.userId,
        successful ? 'notification_responded' : 'notification_ignored',
        new Date(notification.scheduledFor.getTime() + responseTime * 60000)
      );
    }
  }
  
  // Helper methods
  private createDefaultPattern(userId: string): UserBehaviorPattern {
    return {
      userId,
      morningActiveTime: 8,
      afternoonActiveTime: 14,
      eveningActiveTime: 20,
      preferredNotificationGap: 120, // 2 hours
      responsiveTimeRanges: [
        { start: 7, end: 9 },   // Morning
        { start: 12, end: 14 }, // Lunch
        { start: 18, end: 21 }  // Evening
      ],
      habitCompletionPatterns: {},
      timezone: 'UTC',
      notificationPreferences: {
        whatsapp: true,
        sms: false,
        push: true,
        email: false
      }
    };
  }
  
  private updateHabitCompletionPattern(pattern: UserBehaviorPattern, hour: number): void {
    // Track when habits are typically completed
    // This helps time reminders better
  }
  
  private updateActiveTimePattern(pattern: UserBehaviorPattern, hour: number): void {
    // Update user's active time patterns based on app usage
    if (hour >= 5 && hour <= 11) {
      pattern.morningActiveTime = hour;
    } else if (hour >= 12 && hour <= 17) {
      pattern.afternoonActiveTime = hour;
    } else if (hour >= 18 && hour <= 23) {
      pattern.eveningActiveTime = hour;
    }
  }
  
  private updateResponsePattern(pattern: UserBehaviorPattern, hour: number): void {
    // Add this hour to responsive time ranges if user responded
    const existingRange = pattern.responsiveTimeRanges.find(
      range => hour >= range.start && hour <= range.end
    );
    
    if (!existingRange) {
      pattern.responsiveTimeRanges.push({ start: hour, end: hour + 1 });
    }
  }
  
  private adjustForResponsiveTime(pattern: UserBehaviorPattern, optimalHour: number): number {
    // Find the closest responsive time range
    const responsiveRange = pattern.responsiveTimeRanges.find(
      range => Math.abs(optimalHour - range.start) <= 2
    );
    
    return responsiveRange ? responsiveRange.start : optimalHour;
  }
  
  private getOptimalHabitReminderTime(pattern: UserBehaviorPattern): number {
    // Return the time when user is most likely to complete habits
    const responsiveTimes = pattern.responsiveTimeRanges.map(r => r.start);
    return responsiveTimes.length > 0 ? responsiveTimes[0] : 9;
  }
  
  private getOptimalHabitTime(pattern: UserBehaviorPattern, habit: any): Date {
    // Get specific timing for this habit based on its category
    let baseHour = 9;
    
    if (habit.category === 'morning') baseHour = pattern.morningActiveTime || 7;
    else if (habit.category === 'evening') baseHour = pattern.eveningActiveTime || 20;
    else if (habit.category === 'exercise') baseHour = pattern.afternoonActiveTime || 15;
    
    return this.getOptimalNotificationTime(pattern.userId, 'habit_reminder', baseHour);
  }
  
  private getHabitPriority(habit: any): 'high' | 'medium' | 'low' {
    if (habit.currentStreak >= 7) return 'high';
    if (habit.currentStreak >= 3) return 'medium';
    return 'low';
  }
  
  private generateTimeBasedMotivation(hour: number, pattern?: UserBehaviorPattern): any {
    const morningMessages = [
      "Today is full of possibilities! Let's make it amazing! ✨",
      "Your future self will thank you for what you do today 🚀",
      "Success starts with the first step. Take yours now! 💪"
    ];
    
    const afternoonMessages = [
      "You're doing great! Keep that momentum going! 🔥",
      "Afternoon energy boost: You've got this! ⚡",
      "Perfect time to tackle your goals! 🎯"
    ];
    
    const eveningMessages = [
      "Reflect on today's wins and plan tomorrow's victories 🏆",
      "You've made progress today. Celebrate it! 🎉",
      "Rest well, dream big, wake up ready! 🌟"
    ];
    
    let messages = morningMessages;
    if (hour >= 12 && hour < 17) messages = afternoonMessages;
    else if (hour >= 17) messages = eveningMessages;
    
    return {
      affirmation: messages[Math.floor(Math.random() * messages.length)]
    };
  }
  
  private generateHabitReminderContent(habitName: string, streakCount: number, hour: number): any {
    const timeContext = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    
    return {
      message: `Time for your ${timeContext} ${habitName}! 🎯`,
      streakMotivation: streakCount > 0 ? `Keep your ${streakCount}-day streak alive! 🔥` : "Start building your streak today! 💪",
      quickActions: ['Complete Now', 'Snooze 15min', 'Skip Today']
    };
  }
  
  private generateCelebrationContent(achievement: string, streakCount: number): any {
    const celebrations = {
      7: "7-day streak! You're building a real habit! 🔥",
      14: "2 weeks strong! This is becoming part of you! ⚡",
      30: "30 days! You've officially created a superpower! 🚀",
      100: "100 days! You're absolutely unstoppable! 👑"
    };
    
    return {
      message: celebrations[streakCount as keyof typeof celebrations] || `${streakCount} days strong! Amazing! 🌟`,
      achievement
    };
  }
  
  private generateReflectionPrompt(userId: string, hour: number): any {
    const prompts = [
      "What was your biggest win today? 🏆",
      "What are you grateful for right now? 🙏",
      "What would make tomorrow even better? ✨",
      "How do you feel about your progress? 💭"
    ];
    
    return {
      prompt: prompts[Math.floor(Math.random() * prompts.length)]
    };
  }
  
  private getDefaultNotificationTime(type: string, baseHour?: number): Date {
    const defaults = {
      'morning_motivation': 8,
      'habit_reminder': baseHour || 9,
      'evening_reflection': 20,
      'weekly_summary': 10
    };
    
    const hour = defaults[type as keyof typeof defaults] || 9;
    const time = new Date();
    time.setHours(hour, 0, 0, 0);
    
    if (time <= new Date()) {
      time.setDate(time.getDate() + 1);
    }
    
    return time;
  }
  
  // Database operations (would be implemented with actual database)
  private async savePattern(pattern: UserBehaviorPattern): Promise<void> {
    console.log(`💾 Saving behavior pattern for user ${pattern.userId}`);
  }
  
  private async getUserHabits(userId: string): Promise<any[]> {
    // Mock data - would fetch from database
    return [
      { id: '1', name: 'Morning Meditation', category: 'morning', currentStreak: 5 },
      { id: '2', name: 'Exercise', category: 'afternoon', currentStreak: 12 },
      { id: '3', name: 'Evening Journal', category: 'evening', currentStreak: 3 }
    ];
  }
  
  private async isHabitCompletedToday(habitId: string): Promise<boolean> {
    // Check if habit was completed today
    return false;
  }
  
  private async generatePersonalizedAffirmation(userId: string): Promise<string> {
    const affirmations = [
      "You are capable of achieving anything you set your mind to ✨",
      "Today brings new opportunities for growth and success 🚀",
      "Your potential is limitless and your future is bright 🌟"
    ];
    
    return affirmations[Math.floor(Math.random() * affirmations.length)];
  }
  
  private async getNotificationById(notificationId: string): Promise<SmartNotification | null> {
    // Would fetch from database
    return null;
  }
}

// Export singleton
export const smartNotificationEngine = new SmartNotificationEngine();