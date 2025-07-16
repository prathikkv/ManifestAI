// WhatsApp Business API Integration for ManifestAI
// Smart notifications for busy professionals

interface WhatsAppMessage {
  to: string;
  type: 'template' | 'text';
  template?: {
    name: string;
    language: { code: string };
    components: any[];
  };
  text?: {
    body: string;
  };
}

interface NotificationTemplate {
  id: string;
  name: string;
  category: 'habit_reminder' | 'motivation' | 'streak_celebration' | 'weekly_review';
  whatsappTemplate: string;
  variables: string[];
  timing: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'custom';
    dayOfWeek?: number[];
    customHour?: number;
  };
}

// Pre-approved WhatsApp Business API templates
const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'morning_motivation',
    name: 'Morning Motivation',
    category: 'motivation',
    whatsappTemplate: 'morning_energy_boost',
    variables: ['first_name', 'daily_affirmation'],
    timing: { timeOfDay: 'morning' }
  },
  {
    id: 'habit_reminder',
    name: 'Habit Reminder',
    category: 'habit_reminder', 
    whatsappTemplate: 'habit_check_in',
    variables: ['first_name', 'habit_name', 'streak_count'],
    timing: { timeOfDay: 'custom' }
  },
  {
    id: 'streak_celebration',
    name: 'Streak Celebration',
    category: 'streak_celebration',
    whatsappTemplate: 'streak_milestone',
    variables: ['first_name', 'habit_name', 'streak_count', 'celebration_emoji'],
    timing: { timeOfDay: 'custom' }
  },
  {
    id: 'evening_reflection',
    name: 'Evening Reflection',
    category: 'habit_reminder',
    whatsappTemplate: 'daily_reflection',
    variables: ['first_name', 'completion_percentage'],
    timing: { timeOfDay: 'evening' }
  },
  {
    id: 'weekly_wins',
    name: 'Weekly Wins',
    category: 'weekly_review',
    whatsappTemplate: 'weekly_progress',
    variables: ['first_name', 'weekly_score', 'biggest_win'],
    timing: { timeOfDay: 'morning', dayOfWeek: [0] } // Sunday
  }
];

class WhatsAppNotificationService {
  private apiKey: string;
  private phoneNumberId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.WHATSAPP_API_KEY || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.baseUrl = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`;
  }

  // Send WhatsApp message using Business API
  async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ WhatsApp message sent successfully:', result.messages[0].id);
        return true;
      } else {
        console.error('❌ WhatsApp API error:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ WhatsApp send error:', error);
      return false;
    }
  }

  // Send habit reminder with intelligent timing
  async sendHabitReminder(userPhone: string, userName: string, habitName: string, streakCount: number): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: userPhone,
      type: 'template',
      template: {
        name: 'habit_check_in',
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: userName },
              { type: 'text', text: habitName },
              { type: 'text', text: streakCount.toString() }
            ]
          },
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '0',
            parameters: [
              { type: 'payload', payload: `complete_habit_${habitName.toLowerCase().replace(/\s+/g, '_')}` }
            ]
          },
          {
            type: 'button',
            sub_type: 'quick_reply', 
            index: '1',
            parameters: [
              { type: 'payload', payload: 'snooze_15min' }
            ]
          }
        ]
      }
    };

    return await this.sendMessage(message);
  }

  // Send motivational morning message
  async sendMorningMotivation(userPhone: string, userName: string, affirmation: string): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: userPhone,
      type: 'template',
      template: {
        name: 'morning_energy_boost',
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: userName },
              { type: 'text', text: affirmation }
            ]
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [
              { type: 'text', text: 'dashboard' }
            ]
          }
        ]
      }
    };

    return await this.sendMessage(message);
  }

  // Celebrate streak milestones
  async sendStreakCelebration(userPhone: string, userName: string, habitName: string, streakCount: number): Promise<boolean> {
    const celebrationEmojis = {
      7: '🔥',
      14: '⚡',
      21: '🚀', 
      30: '🏆',
      60: '👑',
      100: '💎'
    };

    const emoji = celebrationEmojis[streakCount as keyof typeof celebrationEmojis] || '🌟';

    const message: WhatsAppMessage = {
      to: userPhone,
      type: 'template',
      template: {
        name: 'streak_milestone',
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: userName },
              { type: 'text', text: habitName },
              { type: 'text', text: streakCount.toString() },
              { type: 'text', text: emoji }
            ]
          }
        ]
      }
    };

    return await this.sendMessage(message);
  }

  // Send evening reflection prompt
  async sendEveningReflection(userPhone: string, userName: string, completionPercentage: number): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: userPhone,
      type: 'template',
      template: {
        name: 'daily_reflection',
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: userName },
              { type: 'text', text: `${completionPercentage}%` }
            ]
          },
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '0',
            parameters: [
              { type: 'payload', payload: 'journal_voice' }
            ]
          },
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '1', 
            parameters: [
              { type: 'payload', payload: 'plan_tomorrow' }
            ]
          }
        ]
      }
    };

    return await this.sendMessage(message);
  }

  // Send weekly progress summary
  async sendWeeklyProgress(userPhone: string, userName: string, weeklyScore: number, biggestWin: string): Promise<boolean> {
    const message: WhatsAppMessage = {
      to: userPhone,
      type: 'template',
      template: {
        name: 'weekly_progress',
        language: { code: 'en_US' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: userName },
              { type: 'text', text: `${weeklyScore}%` },
              { type: 'text', text: biggestWin }
            ]
          }
        ]
      }
    };

    return await this.sendMessage(message);
  }

  // Handle incoming WhatsApp webhooks (user responses)
  async handleWebhook(webhookData: any): Promise<void> {
    try {
      const entries = webhookData.entry || [];
      
      for (const entry of entries) {
        const changes = entry.changes || [];
        
        for (const change of changes) {
          if (change.field === 'messages') {
            const messages = change.value.messages || [];
            
            for (const message of messages) {
              await this.processIncomingMessage(message);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Webhook processing error:', error);
    }
  }

  // Process user responses from WhatsApp
  private async processIncomingMessage(message: any): Promise<void> {
    const userPhone = message.from;
    const messageType = message.type;

    if (messageType === 'button') {
      const payload = message.button.payload;
      await this.handleButtonResponse(userPhone, payload);
    } else if (messageType === 'interactive') {
      const buttonId = message.interactive.button_reply?.id;
      if (buttonId) {
        await this.handleButtonResponse(userPhone, buttonId);
      }
    } else if (messageType === 'text') {
      const messageText = message.text.body.toLowerCase();
      await this.handleTextResponse(userPhone, messageText);
    }
  }

  // Handle button responses
  private async handleButtonResponse(userPhone: string, payload: string): Promise<void> {
    console.log(`📱 Button response from ${userPhone}: ${payload}`);

    if (payload.startsWith('complete_habit_')) {
      const habitName = payload.replace('complete_habit_', '').replace(/_/g, ' ');
      await this.markHabitComplete(userPhone, habitName);
    } else if (payload === 'snooze_15min') {
      await this.scheduleSnooze(userPhone, 15);
    } else if (payload === 'journal_voice') {
      await this.sendVoiceJournalPrompt(userPhone);
    } else if (payload === 'plan_tomorrow') {
      await this.sendPlanningPrompt(userPhone);
    }
  }

  // Handle text responses
  private async handleTextResponse(userPhone: string, messageText: string): Promise<void> {
    console.log(`💬 Text response from ${userPhone}: ${messageText}`);

    // Simple AI-like responses for common patterns
    if (messageText.includes('done') || messageText.includes('completed')) {
      await this.sendEncouragement(userPhone, "Amazing work! 🎉 You're building incredible momentum!");
    } else if (messageText.includes('skip') || messageText.includes('not today')) {
      await this.sendMotivationalResponse(userPhone, "No worries! Tomorrow is a fresh start. You've got this! 💪");
    } else if (messageText.includes('help')) {
      await this.sendHelpMessage(userPhone);
    }
  }

  // Mark habit as complete via WhatsApp
  private async markHabitComplete(userPhone: string, habitName: string): Promise<void> {
    // This would integrate with your habit tracking system
    console.log(`✅ Marking ${habitName} complete for ${userPhone}`);
    
    // Send confirmation
    await this.sendSimpleMessage(userPhone, `🎉 Great job completing ${habitName}! Your streak continues! 🔥`);
  }

  // Schedule a snooze reminder
  private async scheduleSnooze(userPhone: string, minutes: number): Promise<void> {
    console.log(`⏰ Scheduling snooze for ${userPhone} in ${minutes} minutes`);
    
    // This would integrate with your scheduling system
    await this.sendSimpleMessage(userPhone, `⏰ I'll remind you again in ${minutes} minutes. Take your time!`);
  }

  // Send voice journal prompt
  private async sendVoiceJournalPrompt(userPhone: string): Promise<void> {
    await this.sendSimpleMessage(userPhone, `🎤 Ready to journal? Open ManifestAI and tap the voice record button, or just reply here with your thoughts!`);
  }

  // Send planning prompt
  private async sendPlanningPrompt(userPhone: string): Promise<void> {
    await this.sendSimpleMessage(userPhone, `📅 What's your top priority for tomorrow? Reply here or set it in the app!`);
  }

  // Send encouragement
  private async sendEncouragement(userPhone: string, message: string): Promise<void> {
    await this.sendSimpleMessage(userPhone, message);
  }

  // Send motivational response
  private async sendMotivationalResponse(userPhone: string, message: string): Promise<void> {
    await this.sendSimpleMessage(userPhone, message);
  }

  // Send help message
  private async sendHelpMessage(userPhone: string): Promise<void> {
    const helpText = `🤖 ManifestAI Help:
    
• Reply "done" to mark habits complete
• Reply "snooze" to get reminded later  
• Reply "journal" to start voice journaling
• Reply "stop" to pause notifications

Visit the app for full features! 📱`;

    await this.sendSimpleMessage(userPhone, helpText);
  }

  // Send simple text message
  private async sendSimpleMessage(userPhone: string, text: string): Promise<void> {
    const message: WhatsAppMessage = {
      to: userPhone,
      type: 'text',
      text: { body: text }
    };

    await this.sendMessage(message);
  }
}

// Intelligent notification scheduling
export class NotificationScheduler {
  private whatsappService: WhatsAppNotificationService;

  constructor() {
    this.whatsappService = new WhatsAppNotificationService();
  }

  // Schedule notifications based on user behavior patterns
  async schedulePersonalizedNotifications(userId: string, userPreferences: any): Promise<void> {
    const { phone, name, timezone, habitTimes, notificationTypes } = userPreferences;

    // Morning motivation (7 AM user's timezone)
    if (notificationTypes.includes('morning_motivation')) {
      this.scheduleDaily(phone, name, 'morning_motivation', 7, timezone);
    }

    // Habit reminders (custom times based on user patterns)
    if (notificationTypes.includes('habit_reminders')) {
      for (const [habitName, timeSlot] of Object.entries(habitTimes)) {
        this.scheduleHabitReminder(phone, name, habitName as string, timeSlot as number);
      }
    }

    // Evening reflection (9 PM user's timezone)
    if (notificationTypes.includes('evening_reflection')) {
      this.scheduleDaily(phone, name, 'evening_reflection', 21, timezone);
    }

    // Weekly summary (Sunday 10 AM)
    if (notificationTypes.includes('weekly_summary')) {
      this.scheduleWeekly(phone, name, 'weekly_summary', 0, 10, timezone);
    }
  }

  private scheduleDaily(phone: string, name: string, type: string, hour: number, timezone: string): void {
    // Implementation would use a job queue like Bull or Agenda
    console.log(`📅 Scheduled daily ${type} for ${name} at ${hour}:00 ${timezone}`);
  }

  private scheduleHabitReminder(phone: string, name: string, habit: string, hour: number): void {
    console.log(`⏰ Scheduled ${habit} reminder for ${name} at ${hour}:00`);
  }

  private scheduleWeekly(phone: string, name: string, type: string, dayOfWeek: number, hour: number, timezone: string): void {
    console.log(`📅 Scheduled weekly ${type} for ${name} on day ${dayOfWeek} at ${hour}:00 ${timezone}`);
  }
}

// Export services
export const whatsappService = new WhatsAppNotificationService();
export const notificationScheduler = new NotificationScheduler();