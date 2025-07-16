// WhatsApp Notification Sending API
// Allows the app to send smart notifications to users

import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp-notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userPhone, userName, ...data } = body;
    
    // Validate request
    if (!type || !userPhone || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields: type, userPhone, userName' },
        { status: 400 }
      );
    }
    
    let success = false;
    
    switch (type) {
      case 'habit_reminder':
        const { habitName, streakCount } = data;
        if (!habitName || streakCount === undefined) {
          return NextResponse.json(
            { error: 'Missing habitName or streakCount for habit_reminder' },
            { status: 400 }
          );
        }
        success = await whatsappService.sendHabitReminder(userPhone, userName, habitName, streakCount);
        break;
        
      case 'morning_motivation':
        const { affirmation } = data;
        if (!affirmation) {
          return NextResponse.json(
            { error: 'Missing affirmation for morning_motivation' },
            { status: 400 }
          );
        }
        success = await whatsappService.sendMorningMotivation(userPhone, userName, affirmation);
        break;
        
      case 'streak_celebration':
        const { habitName: celebrationHabit, streakCount: celebrationStreak } = data;
        if (!celebrationHabit || !celebrationStreak) {
          return NextResponse.json(
            { error: 'Missing habitName or streakCount for streak_celebration' },
            { status: 400 }
          );
        }
        success = await whatsappService.sendStreakCelebration(userPhone, userName, celebrationHabit, celebrationStreak);
        break;
        
      case 'evening_reflection':
        const { completionPercentage } = data;
        if (completionPercentage === undefined) {
          return NextResponse.json(
            { error: 'Missing completionPercentage for evening_reflection' },
            { status: 400 }
          );
        }
        success = await whatsappService.sendEveningReflection(userPhone, userName, completionPercentage);
        break;
        
      case 'weekly_progress':
        const { weeklyScore, biggestWin } = data;
        if (weeklyScore === undefined || !biggestWin) {
          return NextResponse.json(
            { error: 'Missing weeklyScore or biggestWin for weekly_progress' },
            { status: 400 }
          );
        }
        success = await whatsappService.sendWeeklyProgress(userPhone, userName, weeklyScore, biggestWin);
        break;
        
      default:
        return NextResponse.json(
          { error: `Unsupported notification type: ${type}` },
          { status: 400 }
        );
    }
    
    if (success) {
      console.log(`✅ WhatsApp ${type} notification sent to ${userName} (${userPhone})`);
      return NextResponse.json({ 
        success: true, 
        message: `${type} notification sent successfully` 
      });
    } else {
      console.error(`❌ Failed to send WhatsApp ${type} notification to ${userName} (${userPhone})`);
      return NextResponse.json(
        { error: `Failed to send ${type} notification` },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('❌ WhatsApp send API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}