import { db } from './index';
import { PrivacyManager } from './privacy';
import { User, UserProfile, UserPreferences } from '@prisma/client';

export class UserRepository {
  // Create user with privacy-by-design
  static async createUser(
    clerkId: string,
    email: string,
    firstName?: string,
    lastName?: string,
    imageUrl?: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<User> {
    const user = await db.user.create({
      data: {
        clerkId,
        email,
        firstName,
        lastName,
        imageUrl,
        lastActiveAt: new Date(),
      },
    });

    // Create default preferences
    await db.userPreferences.create({
      data: {
        userId: user.id,
        theme: 'system',
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        reminderFrequency: 'daily',
        dataSharing: false,
        analyticsConsent: true,
        personalization: true,
        aiProcessingConsent: true,
        aiModelImprovement: false,
      },
    });

    // Log user creation
    await PrivacyManager.logPrivacyAction(
      user.id,
      'user_created',
      'user_account',
      'User account creation',
      metadata
    );

    return user;
  }

  // Get user by Clerk ID
  static async getUserByClerkId(clerkId: string): Promise<User | null> {
    return await db.user.findUnique({
      where: { clerkId },
      include: {
        profile: true,
        preferences: true,
      },
    });
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    return await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        preferences: true,
      },
    });
  }

  // Update user with privacy logging
  static async updateUser(
    userId: string,
    data: Partial<User>,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<User> {
    const user = await db.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    // Log user update
    await PrivacyManager.logPrivacyAction(
      userId,
      'user_updated',
      'user_account',
      'User account update',
      metadata
    );

    return user;
  }

  // Update user profile
  static async updateUserProfile(
    userId: string,
    profileData: Partial<UserProfile>,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<UserProfile> {
    const profile = await db.userProfile.upsert({
      where: { userId },
      update: {
        ...profileData,
        updatedAt: new Date(),
      },
      create: {
        userId,
        ...profileData,
      },
    });

    // Log profile update
    await PrivacyManager.logPrivacyAction(
      userId,
      'profile_updated',
      'user_profile',
      'User profile update',
      metadata
    );

    return profile;
  }

  // Update user preferences
  static async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<UserPreferences> {
    const userPreferences = await db.userPreferences.upsert({
      where: { userId },
      update: {
        ...preferences,
        updatedAt: new Date(),
      },
      create: {
        userId,
        ...preferences,
      },
    });

    // Log preferences update
    await PrivacyManager.logPrivacyAction(
      userId,
      'preferences_updated',
      'user_preferences',
      'User preferences update',
      metadata
    );

    return userPreferences;
  }

  // Update last active timestamp
  static async updateLastActive(userId: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        lastActiveAt: new Date(),
      },
    });
  }

  // Complete onboarding
  static async completeOnboarding(
    userId: string,
    personalityData?: any,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    await db.$transaction(async (tx) => {
      // Update user onboarding status
      await tx.user.update({
        where: { id: userId },
        data: {
          onboardingCompleted: true,
          updatedAt: new Date(),
        },
      });

      // Create or update profile with personality data
      if (personalityData) {
        await tx.userProfile.upsert({
          where: { userId },
          update: {
            personalityData,
            updatedAt: new Date(),
          },
          create: {
            userId,
            personalityData,
          },
        });
      }
    });

    // Log onboarding completion
    await PrivacyManager.logPrivacyAction(
      userId,
      'onboarding_completed',
      'user_account',
      'User onboarding completed',
      metadata
    );
  }

  // Accept terms and privacy policy
  static async acceptTermsAndPrivacy(
    userId: string,
    termsVersion: string,
    privacyVersion: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    await db.$transaction(async (tx) => {
      // Update user flags
      await tx.user.update({
        where: { id: userId },
        data: {
          termsAccepted: true,
          privacyConsent: true,
          updatedAt: new Date(),
        },
      });

      // Record consent
      await tx.consentRecord.createMany({
        data: [
          {
            userId,
            consentType: 'terms_of_service',
            granted: true,
            version: termsVersion,
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
            method: 'checkbox',
          },
          {
            userId,
            consentType: 'privacy_policy',
            granted: true,
            version: privacyVersion,
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
            method: 'checkbox',
          },
        ],
      });
    });

    // Log consent acceptance
    await PrivacyManager.logPrivacyAction(
      userId,
      'consent_granted',
      'terms_and_privacy',
      'User accepted terms and privacy policy',
      metadata
    );
  }

  // Get user statistics
  static async getUserStats(userId: string): Promise<any> {
    const [dreamsCount, visionBoardsCount, sessionsCount, progressEntries] = await Promise.all([
      db.dream.count({ where: { userId } }),
      db.visionBoard.count({ where: { userId } }),
      db.coachingSession.count({ where: { userId } }),
      db.progressEntry.count({ where: { userId } }),
    ]);

    return {
      dreamsCount,
      visionBoardsCount,
      sessionsCount,
      progressEntries,
    };
  }

  // Check if user exists
  static async userExists(clerkId: string): Promise<boolean> {
    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    return !!user;
  }

  // Get user preferences
  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    return await db.userPreferences.findUnique({
      where: { userId },
    });
  }

  // Get user profile
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    return await db.userProfile.findUnique({
      where: { userId },
    });
  }

  // Soft delete user (schedule for deletion)
  static async softDeleteUser(
    userId: string,
    reason: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    await PrivacyManager.scheduleDataDeletion(userId, reason);
    
    await PrivacyManager.logPrivacyAction(
      userId,
      'user_deletion_requested',
      'user_account',
      `User requested account deletion: ${reason}`,
      metadata
    );
  }

  // Cancel scheduled deletion
  static async cancelDeletion(
    userId: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        deletionScheduledAt: null,
        updatedAt: new Date(),
      },
    });

    await PrivacyManager.logPrivacyAction(
      userId,
      'deletion_cancelled',
      'user_account',
      'User cancelled account deletion',
      metadata
    );
  }

  // Get users due for deletion
  static async getUsersDueForDeletion(): Promise<User[]> {
    return await db.user.findMany({
      where: {
        deletionScheduledAt: {
          lte: new Date(),
        },
      },
    });
  }

  // Get inactive users (for cleanup)
  static async getInactiveUsers(daysInactive: number): Promise<User[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

    return await db.user.findMany({
      where: {
        lastActiveAt: {
          lt: cutoffDate,
        },
        deletionScheduledAt: null,
      },
    });
  }
}

export default UserRepository;