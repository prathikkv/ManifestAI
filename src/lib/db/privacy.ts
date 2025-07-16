import { db } from './index';
import { User, PrivacyLog, ConsentRecord } from '@prisma/client';

// Privacy-focused database operations
export class PrivacyManager {
  // Log privacy-related actions
  static async logPrivacyAction(
    userId: string,
    action: string,
    resource: string,
    purpose: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
      sessionId?: string;
      legalBasis?: string;
    }
  ): Promise<PrivacyLog> {
    return await db.privacyLog.create({
      data: {
        userId,
        action,
        resource,
        purpose,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        sessionId: metadata?.sessionId,
        legalBasis: metadata?.legalBasis,
      },
    });
  }

  // Record user consent
  static async recordConsent(
    userId: string,
    consentType: string,
    granted: boolean,
    version: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
      method?: string;
    }
  ): Promise<ConsentRecord> {
    // Withdraw previous consent if exists
    if (granted) {
      await db.consentRecord.updateMany({
        where: {
          userId,
          consentType,
          withdrawnAt: null,
        },
        data: {
          withdrawnAt: new Date(),
        },
      });
    }

    return await db.consentRecord.create({
      data: {
        userId,
        consentType,
        granted,
        version,
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        method: metadata?.method,
      },
    });
  }

  // Get user's current consent status
  static async getConsentStatus(userId: string, consentType: string): Promise<boolean> {
    const latestConsent = await db.consentRecord.findFirst({
      where: {
        userId,
        consentType,
        withdrawnAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return latestConsent?.granted || false;
  }

  // Data subject access request (GDPR Article 15)
  static async generateDataExport(userId: string): Promise<any> {
    await this.logPrivacyAction(
      userId,
      'data_access',
      'user_data_export',
      'GDPR data subject access request'
    );

    const [
      user,
      profile,
      preferences,
      dreams,
      visionBoards,
      coachingSessions,
      progressEntries,
      consentRecords,
      privacyLogs,
    ] = await Promise.all([
      db.user.findUnique({ where: { id: userId } }),
      db.userProfile.findUnique({ where: { userId } }),
      db.userPreferences.findUnique({ where: { userId } }),
      db.dream.findMany({ where: { userId } }),
      db.visionBoard.findMany({ where: { userId } }),
      db.coachingSession.findMany({ where: { userId } }),
      db.progressEntry.findMany({ where: { userId } }),
      db.consentRecord.findMany({ where: { userId } }),
      db.privacyLog.findMany({ where: { userId } }),
    ]);

    return {
      user: this.sanitizeUserData(user),
      profile: this.sanitizeProfileData(profile),
      preferences,
      dreams: dreams.map(this.sanitizeDreamData),
      visionBoards: visionBoards.map(this.sanitizeVisionBoardData),
      coachingSessions: coachingSessions.map(this.sanitizeSessionData),
      progressEntries,
      consentRecords,
      privacyLogs,
      exportedAt: new Date().toISOString(),
    };
  }

  // Data deletion (GDPR Article 17 - Right to be forgotten)
  static async scheduleDataDeletion(userId: string, reason: string): Promise<void> {
    await this.logPrivacyAction(
      userId,
      'data_deletion_scheduled',
      'user_account',
      `Data deletion scheduled: ${reason}`
    );

    // Schedule deletion in 30 days (grace period)
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 30);

    await db.user.update({
      where: { id: userId },
      data: {
        deletionScheduledAt: deletionDate,
      },
    });
  }

  // Execute data deletion
  static async executeDataDeletion(userId: string): Promise<void> {
    await this.logPrivacyAction(
      userId,
      'data_deletion_executed',
      'user_account',
      'Automated data deletion execution'
    );

    // Delete in reverse order of dependencies
    await db.$transaction(async (tx) => {
      // Delete chat messages first
      await tx.chatMessage.deleteMany({
        where: { session: { userId } },
      });

      // Delete coaching sessions
      await tx.coachingSession.deleteMany({
        where: { userId },
      });

      // Delete vision board elements
      await tx.visionBoardElement.deleteMany({
        where: { visionBoard: { userId } },
      });

      // Delete vision boards
      await tx.visionBoard.deleteMany({
        where: { userId },
      });

      // Delete dream-related data
      await tx.dailyAction.deleteMany({
        where: { actionPlan: { dream: { userId } } },
      });

      await tx.milestone.deleteMany({
        where: { dream: { userId } },
      });

      await tx.obstacle.deleteMany({
        where: { actionPlan: { dream: { userId } } },
      });

      await tx.actionPlan.deleteMany({
        where: { dream: { userId } },
      });

      await tx.progressEntry.deleteMany({
        where: { userId },
      });

      await tx.dream.deleteMany({
        where: { userId },
      });

      // Delete user profile and preferences
      await tx.userProfile.deleteMany({
        where: { userId },
      });

      await tx.userPreferences.deleteMany({
        where: { userId },
      });

      // Delete privacy logs and consent records
      await tx.mentalHealthCheck.deleteMany({
        where: { userId },
      });

      await tx.consentRecord.deleteMany({
        where: { userId },
      });

      await tx.privacyLog.deleteMany({
        where: { userId },
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });
  }

  // Data portability (GDPR Article 20)
  static async generatePortableData(userId: string): Promise<any> {
    await this.logPrivacyAction(
      userId,
      'data_portability',
      'user_data_export',
      'GDPR data portability request'
    );

    const data = await this.generateDataExport(userId);
    
    // Return in a structured, machine-readable format
    return {
      format: 'JSON',
      standard: 'GDPR_Article_20',
      data,
      exportedAt: new Date().toISOString(),
    };
  }

  // Data minimization helper
  static sanitizeUserData(user: User | null): any {
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Exclude sensitive fields
    };
  }

  static sanitizeProfileData(profile: any): any {
    if (!profile) return null;
    
    return {
      id: profile.id,
      coachingStyle: profile.coachingStyle,
      responseLength: profile.responseLength,
      emotionalTone: profile.emotionalTone,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      // Exclude personalityData and behaviorPatterns
    };
  }

  static sanitizeDreamData(dream: any): any {
    return {
      id: dream.id,
      title: dream.title,
      description: dream.description,
      category: dream.category,
      priority: dream.priority,
      status: dream.status,
      targetDate: dream.targetDate,
      tags: dream.tags,
      createdAt: dream.createdAt,
      updatedAt: dream.updatedAt,
    };
  }

  static sanitizeVisionBoardData(visionBoard: any): any {
    return {
      id: visionBoard.id,
      title: visionBoard.title,
      description: visionBoard.description,
      layout: visionBoard.layout,
      isPublic: visionBoard.isPublic,
      createdAt: visionBoard.createdAt,
      updatedAt: visionBoard.updatedAt,
    };
  }

  static sanitizeSessionData(session: any): any {
    return {
      id: session.id,
      sessionType: session.sessionType,
      duration: session.duration,
      sentiment: session.sentiment,
      emotions: session.emotions,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  // Check if user has given specific consent
  static async hasConsent(userId: string, consentType: string): Promise<boolean> {
    const consent = await db.consentRecord.findFirst({
      where: {
        userId,
        consentType,
        granted: true,
        withdrawnAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return !!consent;
  }

  // Get all consents for a user
  static async getUserConsents(userId: string): Promise<ConsentRecord[]> {
    return await db.consentRecord.findMany({
      where: {
        userId,
        withdrawnAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Withdraw consent
  static async withdrawConsent(userId: string, consentType: string): Promise<void> {
    await db.consentRecord.updateMany({
      where: {
        userId,
        consentType,
        withdrawnAt: null,
      },
      data: {
        withdrawnAt: new Date(),
      },
    });

    await this.logPrivacyAction(
      userId,
      'consent_withdrawn',
      consentType,
      'User withdrew consent'
    );
  }
}

// Data retention cleanup job
export async function cleanupExpiredData(): Promise<void> {
  const policies = await db.dataRetentionPolicy.findMany({
    where: {
      activeUntil: {
        gte: new Date(),
      },
    },
  });

  for (const policy of policies) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.retentionPeriod);

    // Implement cleanup logic based on dataType
    switch (policy.dataType) {
      case 'privacy_logs':
        await db.privacyLog.deleteMany({
          where: {
            createdAt: {
              lt: cutoffDate,
            },
          },
        });
        break;
      
      case 'system_audit_logs':
        await db.systemAuditLog.deleteMany({
          where: {
            createdAt: {
              lt: cutoffDate,
            },
          },
        });
        break;
      
      case 'content_safety_logs':
        await db.contentSafetyLog.deleteMany({
          where: {
            createdAt: {
              lt: cutoffDate,
            },
          },
        });
        break;
      
      // Add more cases as needed
    }
  }
}

// Process scheduled deletions
export async function processScheduledDeletions(): Promise<void> {
  const usersToDelete = await db.user.findMany({
    where: {
      deletionScheduledAt: {
        lte: new Date(),
      },
    },
  });

  for (const user of usersToDelete) {
    await PrivacyManager.executeDataDeletion(user.id);
  }
}