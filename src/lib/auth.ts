import { auth, currentUser } from '@clerk/nextjs/server';
import { User } from '@/types';

export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const user = await currentUser();
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      imageUrl: user.imageUrl,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
      onboardingCompleted: user.publicMetadata.onboardingCompleted as boolean || false,
      privacyConsent: user.publicMetadata.privacyConsent as boolean || false,
      termsAccepted: user.publicMetadata.termsAccepted as boolean || false,
      personalityProfile: user.publicMetadata.personalityProfile as User['personalityProfile'],
      preferences: user.publicMetadata.preferences as User['preferences'] || {
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          sms: false,
          reminderFrequency: 'daily',
        },
        privacy: {
          dataSharing: false,
          analytics: true,
          personalization: true,
        },
        ai: {
          coachingStyle: 'balanced',
          responseLength: 'detailed',
          emotionalTone: 'encouraging',
        },
      },
    };
  } catch (error) {
    console.error('Error fetching authenticated user:', error);
    return null;
  }
}

export async function getUserId(): Promise<string | null> {
  try {
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
}

export async function requireAuth(): Promise<string> {
  const userId = await getUserId();
  
  if (!userId) {
    throw new Error('Authentication required');
  }
  
  return userId;
}

export async function updateUserMetadata(userId: string, metadata: Partial<User>) {
  try {
    const { clerkClient } = await import('@clerk/nextjs/server');
    
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        onboardingCompleted: metadata.onboardingCompleted,
        privacyConsent: metadata.privacyConsent,
        termsAccepted: metadata.termsAccepted,
        personalityProfile: metadata.personalityProfile,
        preferences: metadata.preferences,
      },
    });
  } catch (error) {
    console.error('Error updating user metadata:', error);
    throw error;
  }
}

export function getSignInUrl(redirectUrl?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in';
  return redirectUrl ? `${baseUrl}?redirect_url=${encodeURIComponent(redirectUrl)}` : baseUrl;
}

export function getSignUpUrl(redirectUrl?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up';
  return redirectUrl ? `${baseUrl}?redirect_url=${encodeURIComponent(redirectUrl)}` : baseUrl;
}

export function getAfterSignInUrl(): string {
  return process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard';
}

export function getAfterSignUpUrl(): string {
  return process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/onboarding';
}