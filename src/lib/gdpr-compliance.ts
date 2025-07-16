// GDPR Compliance Utilities for ManifestAI
// Provides data export, deletion, and privacy management features

import { prisma } from './db';
import { decrypt, maskPersonalData, generateSecureToken } from './encryption';
import { User, Dream, VisionBoard, JournalEntry, Habit, Affirmation } from '@prisma/client';

export interface DataExportRequest {
  userId: string;
  format: 'json' | 'csv';
  includeAnalytics?: boolean;
  includeAIData?: boolean;
}

export interface ExportedData {
  user: any;
  profile: any;
  dreams: any[];
  visionBoards: any[];
  journalEntries: any[];
  habits: any[];
  affirmations: any[];
  milestones: any[];
  analytics?: any;
  aiConversations?: any[];
  metadata: {
    exportedAt: string;
    version: string;
    format: string;
  };
}

// GDPR Article 20 - Right to Data Portability
export async function exportUserData(request: DataExportRequest): Promise<ExportedData> {
  const { userId, format, includeAnalytics = false, includeAIData = false } = request;

  try {
    // Fetch all user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        dreams: {
          include: {
            milestones: true,
            progressUpdates: true,
            images: true,
            visionBoards: true
          }
        },
        visionBoards: true,
        journalEntries: true,
        habits: {
          include: {
            completions: true
          }
        },
        affirmations: true,
        milestones: true,
        ...(includeAnalytics && { analytics: true }),
        ...(includeAIData && { aiConversations: true })
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Decrypt and sanitize sensitive fields
    const exportedData: ExportedData = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
        privacySettings: user.privacySettings
      },
      profile: user.profile ? {
        displayName: user.profile.displayName,
        bio: user.profile.bio,
        timezone: user.profile.timezone,
        locale: user.profile.locale,
        preferences: user.profile.preferences,
        // Decrypt personality data if it exists
        personalityData: user.profile.personalityData ? 
          decrypt(user.profile.personalityData as string) : null,
        behaviorPatterns: user.profile.behaviorPatterns ?
          decrypt(user.profile.behaviorPatterns as string) : null
      } : null,
      dreams: user.dreams.map(dream => ({
        id: dream.id,
        title: dream.title,
        description: dream.description,
        category: dream.category,
        status: dream.status,
        targetDate: dream.targetDate,
        createdAt: dream.createdAt,
        completedAt: dream.completedAt,
        milestones: dream.milestones,
        progressUpdates: dream.progressUpdates,
        images: dream.images,
        visionBoards: dream.visionBoards.map(vb => ({
          id: vb.id,
          title: vb.title,
          description: vb.description,
          layout: vb.layout,
          elements: vb.elements,
          theme: vb.theme,
          createdAt: vb.createdAt
        }))
      })),
      visionBoards: user.visionBoards.map(vb => ({
        id: vb.id,
        title: vb.title,
        description: vb.description,
        layout: vb.layout,
        elements: vb.elements,
        theme: vb.theme,
        createdAt: vb.createdAt
      })),
      journalEntries: user.journalEntries.map(entry => ({
        id: entry.id,
        // Decrypt journal content
        content: decrypt(entry.content),
        mood: entry.mood,
        tags: entry.tags,
        sentimentScore: entry.sentimentScore,
        createdAt: entry.createdAt
      })),
      habits: user.habits.map(habit => ({
        id: habit.id,
        title: habit.title,
        description: habit.description,
        frequency: habit.frequency,
        targetCount: habit.targetCount,
        currentStreak: habit.currentStreak,
        longestStreak: habit.longestStreak,
        isActive: habit.isActive,
        createdAt: habit.createdAt,
        completions: habit.completions
      })),
      affirmations: user.affirmations,
      milestones: user.milestones,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        format
      }
    };

    // Add analytics if requested
    if (includeAnalytics && user.analytics) {
      exportedData.analytics = user.analytics;
    }

    // Add AI conversations if requested (anonymized)
    if (includeAIData && user.aiConversations) {
      exportedData.aiConversations = user.aiConversations.map(conv => ({
        id: conv.id,
        sessionId: conv.sessionId,
        context: conv.context,
        createdAt: conv.createdAt,
        // Decrypt messages but anonymize personal details
        messages: maskPersonalData(decrypt(conv.messages as string))
      }));
    }

    return exportedData;
  } catch (error) {
    console.error('Data export failed:', error);
    throw new Error('Failed to export user data');
  }
}

// Generate downloadable export file
export async function generateDataExportFile(
  userId: string, 
  format: 'json' | 'csv' = 'json'
): Promise<string> {
  const data = await exportUserData({ userId, format, includeAnalytics: true });
  
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  
  if (format === 'csv') {
    // Convert to CSV format (simplified for main data)
    const csv = [
      'Type,ID,Title,Description,Created At',
      ...data.dreams.map(d => `Dream,${d.id},"${d.title}","${d.description}",${d.createdAt}`),
      ...data.habits.map(h => `Habit,${h.id},"${h.title}","${h.description}",${h.createdAt}`),
      ...data.affirmations.map(a => `Affirmation,${a.id},"${a.text}","${a.category}",${a.createdAt}`)
    ].join('\n');
    
    return csv;
  }
  
  throw new Error('Unsupported export format');
}

// GDPR Article 17 - Right to Erasure (Right to be Forgotten)
export async function scheduleUserDeletion(userId: string, reason?: string): Promise<void> {
  const deletionDate = new Date();
  deletionDate.setDate(deletionDate.getDate() + 30); // 30-day grace period

  await prisma.deletionRequest.create({
    data: {
      userId,
      scheduledFor: deletionDate,
      reason: reason || 'User requested account deletion'
    }
  });

  console.log(`User ${userId} scheduled for deletion on ${deletionDate.toISOString()}`);
}

// Process scheduled deletions
export async function processScheduledDeletions(): Promise<void> {
  const now = new Date();
  
  const pendingDeletions = await prisma.deletionRequest.findMany({
    where: {
      scheduledFor: { lte: now },
      completedAt: null
    },
    include: {
      user: true
    }
  });

  for (const deletion of pendingDeletions) {
    try {
      // Delete user data in proper order (respecting foreign key constraints)
      await prisma.$transaction(async (tx) => {
        // Delete related data first
        await tx.habitCompletion.deleteMany({ where: { habit: { userId: deletion.userId } } });
        await tx.progressUpdate.deleteMany({ where: { dream: { userId: deletion.userId } } });
        await tx.dreamImage.deleteMany({ where: { dream: { userId: deletion.userId } } });
        
        // Delete main entities
        await tx.aiConversation.deleteMany({ where: { userId: deletion.userId } });
        await tx.journalEntry.deleteMany({ where: { userId: deletion.userId } });
        await tx.habit.deleteMany({ where: { userId: deletion.userId } });
        await tx.affirmation.deleteMany({ where: { userId: deletion.userId } });
        await tx.milestone.deleteMany({ where: { userId: deletion.userId } });
        await tx.visionBoard.deleteMany({ where: { userId: deletion.userId } });
        await tx.dream.deleteMany({ where: { userId: deletion.userId } });
        await tx.userAnalytics.deleteMany({ where: { userId: deletion.userId } });
        await tx.consent.deleteMany({ where: { userId: deletion.userId } });
        await tx.dataExportLog.deleteMany({ where: { userId: deletion.userId } });
        await tx.profile.deleteMany({ where: { userId: deletion.userId } });
        
        // Finally delete the user
        await tx.user.delete({ where: { id: deletion.userId } });
        
        // Mark deletion as completed
        await tx.deletionRequest.update({
          where: { id: deletion.id },
          data: { completedAt: now }
        });
      });

      console.log(`Successfully deleted user ${deletion.userId}`);
    } catch (error) {
      console.error(`Failed to delete user ${deletion.userId}:`, error);
    }
  }
}

// GDPR Article 21 - Right to Object
export async function updateConsentSettings(
  userId: string, 
  consentType: string, 
  granted: boolean
): Promise<void> {
  await prisma.consent.create({
    data: {
      userId,
      type: consentType as any,
      version: '1.0',
      granted,
      ipAddress: '0.0.0.0', // Should be provided by request
      userAgent: 'system'
    }
  });

  // Update user privacy settings
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { privacySettings: true }
  });

  if (user) {
    const settings = user.privacySettings as any;
    settings[consentType] = granted;

    await prisma.user.update({
      where: { id: userId },
      data: { privacySettings: settings }
    });
  }
}

// Data retention policy enforcement
export async function enforceDataRetention(): Promise<void> {
  const retentionPeriod = 365 * 2; // 2 years for inactive accounts
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionPeriod);

  // Find inactive users
  const inactiveUsers = await prisma.user.findMany({
    where: {
      lastActiveAt: { lt: cutoffDate },
      deletionRequests: { none: {} } // Not already scheduled for deletion
    },
    select: { id: true, email: true, lastActiveAt: true }
  });

  for (const user of inactiveUsers) {
    await scheduleUserDeletion(user.id, 'Data retention policy - inactive account');
    console.log(`Scheduled inactive user ${user.email} for deletion`);
  }
}

// Generate privacy report
export async function generatePrivacyReport(userId: string): Promise<any> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      consentHistory: true,
      dataExportLogs: true,
      deletionRequests: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    userId: user.id,
    email: maskPersonalData(user.email),
    accountCreated: user.createdAt,
    lastActive: user.lastActiveAt,
    privacySettings: user.privacySettings,
    consentHistory: user.consentHistory.map(c => ({
      type: c.type,
      granted: c.granted,
      grantedAt: c.grantedAt,
      version: c.version
    })),
    dataExports: user.dataExportLogs.map(log => ({
      requestedAt: log.requestedAt,
      completedAt: log.completedAt,
      format: log.format
    })),
    deletionRequests: user.deletionRequests.map(req => ({
      requestedAt: req.requestedAt,
      scheduledFor: req.scheduledFor,
      completedAt: req.completedAt,
      reason: req.reason
    }))
  };
}