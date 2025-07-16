export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  onboardingCompleted: boolean;
  privacyConsent: boolean;
  termsAccepted: boolean;
  personalityProfile?: PersonalityProfile;
  preferences: UserPreferences;
}

export interface PersonalityProfile {
  bigFive: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  motivationStyle: 'achievement' | 'affiliation' | 'power' | 'autonomy';
  communicationStyle: 'direct' | 'supportive' | 'analytical' | 'expressive';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  stressResponse: 'fight' | 'flight' | 'freeze' | 'fawn';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'bi-weekly';
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    personalization: boolean;
  };
  ai: {
    coachingStyle: 'gentle' | 'firm' | 'balanced';
    responseLength: 'brief' | 'detailed';
    emotionalTone: 'encouraging' | 'neutral' | 'challenging';
  };
}

export interface Dream {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: DreamCategory;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'paused' | 'completed' | 'archived';
  targetDate?: Date;
  estimatedDuration?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  visionBoard?: VisionBoard;
  actionPlan: ActionPlan;
  progress: DreamProgress;
}

export type DreamCategory = 
  | 'career'
  | 'relationships'
  | 'health'
  | 'finance'
  | 'education'
  | 'travel'
  | 'creativity'
  | 'spirituality'
  | 'lifestyle'
  | 'personal-growth';

export interface VisionBoard {
  id: string;
  dreamId: string;
  title: string;
  description?: string;
  layout: 'grid' | 'collage' | 'timeline' | 'mindmap';
  backgroundColor: string;
  elements: VisionBoardElement[];
  isPublic: boolean;
  collaborators: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VisionBoardElement {
  id: string;
  type: 'image' | 'text' | 'quote' | 'goal' | 'affirmation';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
    opacity?: number;
  };
  metadata?: {
    source?: string;
    aiGenerated?: boolean;
    tags?: string[];
  };
}

export interface ActionPlan {
  id: string;
  dreamId: string;
  milestones: Milestone[];
  dailyActions: DailyAction[];
  weeklyGoals: WeeklyGoal[];
  obstacles: ObstaclePreparation[];
  resources: Resource[];
  timeline: TimelineEvent[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completed: boolean;
  completedAt?: Date;
  success_metrics: string[];
  reward?: string;
}

export interface DailyAction {
  id: string;
  title: string;
  description: string;
  category: 'habit' | 'task' | 'mindset' | 'learning';
  estimatedTime: number;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completedAt?: Date;
  streak: number;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  completed: boolean;
  weekStarting: Date;
}

export interface ObstaclePreparation {
  id: string;
  obstacle: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  contingencyPlan: string;
  resources: string[];
}

export interface Resource {
  id: string;
  type: 'book' | 'course' | 'tool' | 'person' | 'website' | 'app';
  title: string;
  description: string;
  url?: string;
  cost?: number;
  priority: 'low' | 'medium' | 'high';
  accessed: boolean;
  accessedAt?: Date;
}

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'milestone' | 'action' | 'review' | 'celebration';
  completed: boolean;
}

export interface DreamProgress {
  id: string;
  dreamId: string;
  overall: number;
  milestones: number;
  actions: number;
  consistency: number;
  lastUpdated: Date;
  streaks: {
    current: number;
    longest: number;
    total: number;
  };
  predictions: {
    completionDate: Date;
    successProbability: number;
    confidenceLevel: number;
  };
}

export interface AICoachingSession {
  id: string;
  userId: string;
  dreamId?: string;
  type: 'general' | 'dream-specific' | 'obstacle-solving' | 'motivation' | 'planning';
  messages: ChatMessage[];
  sentiment: 'positive' | 'neutral' | 'negative';
  emotions: string[];
  insights: string[];
  recommendations: string[];
  followUpActions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    tokens?: number;
    model?: string;
    temperature?: number;
    confidence?: number;
  };
}

export interface ContentSafetyResult {
  flagged: boolean;
  categories: {
    harassment: boolean;
    hate: boolean;
    self_harm: boolean;
    sexual: boolean;
    violence: boolean;
  };
  category_scores: {
    harassment: number;
    hate: number;
    self_harm: number;
    sexual: number;
    violence: number;
  };
}

export interface MentalHealthCheck {
  id: string;
  userId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'crisis';
  indicators: string[];
  recommendations: string[];
  professionalReferral: boolean;
  timestamp: Date;
  followUpRequired: boolean;
}

export interface PrivacyConsent {
  id: string;
  userId: string;
  dataProcessing: boolean;
  aiAnalysis: boolean;
  analytics: boolean;
  marketing: boolean;
  sharing: boolean;
  retention: boolean;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  version: string;
}

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  path: string;
}