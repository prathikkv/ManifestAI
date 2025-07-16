# 7 Claude rules
1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the [todo.md](http://todo.md/) file with a summary of the changes you made and any other relevant information.



# **🌟 ADVANCED DREAMBOARD: Production-Ready AI Manifestation Platform**

## **PROMPT DOCUMENT FOR CLAUDE CODE**

---

## **🚀 PROJECT OVERVIEW**

Build a cutting-edge, production-ready AI-powered manifestation platform using the latest technologies. This should be a world-class application that combines advanced AI/ML, modern UX design, and scalable architecture to help users achieve their dreams through intelligent guidance and beautiful visualizations.

---

## **🧠 ADVANCED AI ARCHITECTURE**

### **1. Multi-Model AI System**
```javascript
// Implement sophisticated AI pipeline
const AIOrchestrator = {
  // Primary LLM for manifestation coaching
  manifestationLLM: 'gpt-4-turbo',
  
  // Specialized models for different tasks
  visionAnalysis: 'gpt-4-vision-preview',
  imageGeneration: 'dall-e-3',
  speechSynthesis: 'tts-1-hd',
  speechRecognition: 'whisper-1',
  
  // Custom fine-tuned model for manifestation
  manifestationExpert: 'ft:gpt-4:manifestation-coach',
  
  // RAG system for knowledge retrieval
  knowledgeBase: 'text-embedding-3-large'
};
```

### **2. Model Context Protocol (MCP) Integration**
```javascript
// Advanced context management
class ManifestationMCP {
  constructor() {
    this.contextWindow = 128000; // Extended context
    this.memoryLayers = {
      shortTerm: new Map(), // Current session
      mediumTerm: new LRUCache(1000), // User patterns
      longTerm: new PersistentMemory() // Life journey
    };
  }
  
  async processWithContext(userInput, dreamContext) {
    const enrichedContext = await this.buildDynamicContext({
      userHistory: await this.getUserJourney(userId),
      dreamProgress: await this.getDreamProgress(dreamId),
      personalityProfile: await this.getPersonalityInsights(userId),
      contextualKnowledge: await this.retrieveRelevantKnowledge(userInput)
    });
    
    return await this.generateResponse(userInput, enrichedContext);
  }
}
```

### **3. Advanced ML Features**
```javascript
// Implement sophisticated ML capabilities
const MLPipeline = {
  // Dream success prediction
  successPredictor: new TensorFlow.Model('dream-success-predictor'),
  
  // Personality analysis from text
  personalityAnalyzer: new TransformerModel('personality-insights'),
  
  // Optimal timing recommendations
  timingOptimizer: new ReinforcementLearning('action-timing'),
  
  // Progress pattern recognition
  progressAnalyzer: new TimeSeriesAnalyzer('user-progress'),
  
  // Computer vision for vision board analysis
  visionBoardAnalyzer: new VisionModel('vision-board-insights')
};
```

---

## **🎨 WORLD-CLASS UX/UI ARCHITECTURE**

### **1. Advanced React Architecture**
```javascript
// Modern React patterns with advanced features
const TechStack = {
  frontend: {
    framework: 'Next.js 14+ (App Router)',
    ui: 'Tailwind CSS + Shadcn/UI',
    animations: 'Framer Motion + Lottie',
    state: 'Zustand + TanStack Query',
    forms: 'React Hook Form + Zod',
    charts: 'Recharts + D3.js',
    3d: 'Three.js + React Three Fiber',
    voice: 'Web Speech API + Azure Cognitive Services'
  },
  
  backend: {
    runtime: 'Node.js + TypeScript',
    framework: 'Fastify + tRPC',
    database: 'PostgreSQL + Prisma + Redis',
    ai: 'OpenAI + Langchain + Pinecone',
    realtime: 'Socket.io + Server-Sent Events',
    queues: 'Bull MQ + Redis'
  }
};
```

### **2. Micro-Interactions & Animations**
```javascript
// Advanced animation system
const AnimationSystem = {
  // Dream visualization particles
  dreamParticles: new ParticleSystem({
    count: 1000,
    behavior: 'manifestation-energy',
    responsiveToUserEmotion: true
  }),
  
  // Progress celebration animations
  achievementCelebration: new LottieAnimation({
    trigger: 'milestone-completion',
    customization: 'user-personality-based'
  }),
  
  // Smooth page transitions
  pageTransitions: new FramerMotion({
    type: 'spring',
    damping: 0.8,
    stiffness: 100
  })
};
```

### **3. Voice & Conversational UI**
```javascript
// Advanced voice interaction
class VoiceManifestationCoach {
  async initializeVoiceUI() {
    this.speechRecognition = new webkitSpeechRecognition();
    this.speechSynthesis = window.speechSynthesis;
    this.voicePersonality = await this.loadPersonalizedVoice();
  }
  
  async handleVoiceInput(audioStream) {
    const transcription = await openai.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-1"
    });
    
    const response = await this.processManifestationInput(transcription.text);
    
    const speech = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: this.voicePersonality,
      input: response
    });
    
    return speech;
  }
}
```

---

## **🏗️ PRODUCTION ARCHITECTURE**

### **1. Scalable Infrastructure**
```javascript
// Production-ready architecture
const ProductionStack = {
  deployment: {
    frontend: 'Vercel Edge Functions',
    backend: 'Railway + Docker',
    database: 'Supabase + PlanetScale',
    cdn: 'Cloudflare R2',
    monitoring: 'Sentry + PostHog',
    analytics: 'Mixpanel + Custom Events'
  },
  
  security: {
    auth: 'Clerk + JWT',
    rateLimit: 'Upstash Redis',
    encryption: 'AES-256 + bcrypt',
    validation: 'Zod schemas',
    sanitization: 'DOMPurify'
  },
  
  performance: {
    caching: 'Redis + Edge caching',
    optimization: 'Bundle splitting + Tree shaking',
    images: 'Sharp + WebP + AVIF',
    database: 'Connection pooling + Query optimization'
  }
};
```

### **2. Advanced Testing Strategy**
```javascript
// Comprehensive testing framework
const TestingFramework = {
  unit: 'Vitest + Testing Library',
  integration: 'Cypress + Playwright',
  e2e: 'Playwright + Percy Visual Testing',
  ai: 'Custom AI response testing suite',
  performance: 'Lighthouse CI + Web Vitals',
  accessibility: 'axe-core + WAVE',
  security: 'OWASP ZAP + Snyk'
};
```

---

## **🎯 DETAILED IMPLEMENTATION SPECIFICATIONS**

### **PHASE 1: CORE PLATFORM (Weeks 1-4)**

#### **1. Advanced User Onboarding**
```typescript
interface OnboardingFlow {
  // AI-powered personality assessment
  personalityQuiz: {
    questions: AdaptiveQuestion[];
    aiAnalysis: PersonalityInsights;
    dreamCompatibility: DreamTypeRecommendations;
  };
  
  // Dream discovery workshop
  dreamDiscovery: {
    voiceRecording: AudioAnalysis;
    visualAssociation: ImageSelection;
    lifeMapping: TimelineCreation;
    priorityMatrix: DreamPrioritization;
  };
  
  // Goal architecture
  goalStructure: {
    primaryDream: MainGoal;
    subGoals: DependentGoals[];
    milestones: TrackableCheckpoints[];
    timeline: AdaptiveSchedule;
  };
}
```

#### **2. Intelligent Vision Board Creator**
```typescript
class AdvancedVisionBoard {
  // AI-powered image generation and curation
  async createIntelligentBoard(dreamData: DreamAnalysis) {
    const aiGeneratedImages = await Promise.all([
      this.generateDreamVisualization(dreamData.primaryGoal),
      this.generateLifestyleImages(dreamData.desiredLifestyle),
      this.generateSymbolicRepresentation(dreamData.emotions),
      this.generateProgressMilestones(dreamData.timeline)
    ]);
    
    const curatedStockImages = await this.intelligentImageCuration(dreamData);
    const userImages = await this.analyzeUserUploads(dreamData.userPhotos);
    
    return this.composeOptimalLayout({
      aiImages: aiGeneratedImages,
      stockImages: curatedStockImages,
      userImages: userImages,
      personalityProfile: dreamData.personality
    });
  }
  
  // Real-time collaborative editing
  enableRealTimeCollaboration() {
    this.socket.on('boardUpdate', this.handleCollaborativeUpdate);
    this.implementConflictResolution();
    this.addLiveUserCursors();
  }
}
```

#### **3. Advanced AI Manifestation Coach**
```typescript
class ManifestationAI {
  private models = {
    coach: new OpenAI({ model: 'gpt-4-turbo' }),
    analyzer: new FineTunedModel('manifestation-expert'),
    predictor: new MLModel('success-predictor')
  };
  
  async generatePersonalizedPlan(userProfile: UserProfile, dream: Dream) {
    // Multi-model approach for comprehensive planning
    const psychologicalAnalysis = await this.analyzePsychologicalProfile(userProfile);
    const resourceAssessment = await this.assessAvailableResources(userProfile);
    const obstaclePredicition = await this.predictPotentialObstacles(dream, userProfile);
    const successProbability = await this.calculateSuccessMetrics(dream, userProfile);
    
    const plan = await this.models.coach.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: this.buildExpertSystemPrompt(psychologicalAnalysis, resourceAssessment)
        },
        {
          role: "user", 
          content: this.constructPlanningPrompt(dream, obstaclePredicition, successProbability)
        }
      ],
      tools: [
        this.getProgressTrackingTool(),
        this.getResourceRecommendationTool(),
        this.getMotivationTool(),
        this.getTimelineTool()
      ]
    });
    
    return this.processAndStructurePlan(plan);
  }
}
```

---

### **PHASE 2: ADVANCED FEATURES (Weeks 5-8)**

#### **1. Real-Time Progress Analytics**
```typescript
interface AdvancedAnalytics {
  // Predictive progress modeling
  progressPrediction: {
    algorithm: 'LSTM + Transformer',
    features: ['daily_actions', 'emotional_state', 'external_factors'],
    accuracy: 85, // Target accuracy percentage
    updateFrequency: 'hourly'
  };
  
  // Behavioral pattern recognition
  patternAnalysis: {
    successPatterns: UserBehaviorPattern[];
    struggleIndicators: EarlyWarningSignal[];
    optimizationSuggestions: ActionableInsight[];
  };
  
  // Dynamic goal adjustment
  adaptiveGoals: {
    difficultyAdjustment: 'ML-powered',
    timelineOptimization: 'constraint-based',
    resourceReallocation: 'intelligent'
  };
}
```

#### **2. Community & Social Features**
```typescript
class ManifestationCommunity {
  // AI-powered community matching
  async findAccountabilityPartners(user: User) {
    const embedding = await this.generateUserEmbedding(user);
    const compatibleUsers = await this.vectorSearch(embedding, {
      filters: {
        dreamCategory: user.dream.category,
        personalityCompatibility: 0.8,
        timeZoneOverlap: 0.6,
        progressLevel: 'similar'
      }
    });
    
    return this.rankByCompatibility(compatibleUsers);
  }
  
  // Intelligent group formation
  async createMastermindGroups() {
    const users = await this.getActiveUsers();
    const groups = await this.optimizeGroupFormation(users, {
      diversityScore: 0.7,
      skillComplementarity: 0.8,
      commitmentLevel: 'high',
      groupSize: [4, 6]
    });
    
    return groups;
  }
}
```

#### **3. Gamification & Motivation System**
```typescript
interface GamificationEngine {
  // Dynamic reward system
  rewardSystem: {
    pointsAlgorithm: 'behavior-weighted',
    badgeSystem: 'achievement-trees',
    levelProgression: 'skill-based',
    socialRecognition: 'peer-validated'
  };
  
  // Personalized challenges
  challengeGenerator: {
    difficultyAdaptation: 'ML-optimized',
    personalityAlignment: 'big-five-based',
    socialElements: 'team-challenges',
    realWorldConnection: 'location-aware'
  };
  
  // Motivation maintenance
  motivationAI: {
    emotionalStateTracking: 'sentiment-analysis',
    interventionTiming: 'predictive',
    messagePersonalization: 'user-history-based',
    encouragementStyle: 'personality-matched'
  };
}
```

---

### **PHASE 3: ENTERPRISE & MONETIZATION (Weeks 9-12)**

#### **1. Advanced Subscription System**
```typescript
interface MonetizationEngine {
  // Intelligent pricing
  dynamicPricing: {
    algorithm: 'value-based + usage-analytics',
    personalizedOffers: 'ML-generated',
    churnPrevention: 'predictive-intervention',
    upsellOptimization: 'behavioral-triggers'
  };
  
  // Multiple revenue streams
  revenueStreams: {
    subscriptions: PricingTier[];
    marketplace: DigitalProducts[];
    coaching: PersonalCoaching[];
    corporate: EnterprisePackages[];
    affiliate: PartnerProgram;
  };
}
```

#### **2. B2B Enterprise Features**
```typescript
class EnterpriseManifestationPlatform {
  // Corporate vision alignment
  async alignOrganizationalGoals(company: Enterprise) {
    const companyVision = await this.analyzeCompanyDocuments(company.documents);
    const employeeAspirations = await this.aggregateEmployeeDreams(company.employees);
    const alignmentMatrix = await this.calculateVisionAlignment(companyVision, employeeAspirations);
    
    return this.generateAlignmentStrategy(alignmentMatrix);
  }
  
  // Team manifestation workshops
  async facilitateTeamWorkshops(team: Team) {
    const personalityMix = await this.analyzeTeamDynamics(team);
    const workshopPlan = await this.generateCustomWorkshop(personalityMix);
    const facilitationAI = await this.loadFacilitationPersonality();
    
    return this.executeVirtualWorkshop(workshopPlan, facilitationAI);
  }
}
```

---

## **🧪 COMPREHENSIVE TESTING STRATEGY**

### **1. AI Testing Framework**
```typescript
class AITestingSuite {
  // LLM response quality testing
  async testManifestationAdvice() {
    const testCases = await this.loadTestCases('manifestation-scenarios');
    const results = await Promise.all(
      testCases.map(async (testCase) => {
        const response = await this.manifestationAI.generateAdvice(testCase.input);
        return {
          relevance: await this.scoreRelevance(response, testCase.expected),
          helpfulness: await this.scoreHelpfulness(response),
          safety: await this.scoreSafety(response),
          personalization: await this.scorePersonalization(response, testCase.user)
        };
      })
    );
    
    return this.generateTestReport(results);
  }
  
  // Vision board quality testing
  async testVisionBoardGeneration() {
    const aestheticQuality = await this.testAestheticQuality();
    const relevanceScore = await this.testDreamRelevance();
    const inspirationLevel = await this.testInspirationMetrics();
    
    return { aestheticQuality, relevanceScore, inspirationLevel };
  }
}
```

### **2. Performance Testing**
```typescript
const PerformanceTests = {
  // Load testing for AI endpoints
  aiLoadTest: {
    concurrentUsers: 1000,
    requestsPerSecond: 100,
    averageResponseTime: '<2s',
    p95ResponseTime: '<5s',
    errorRate: '<0.1%'
  },
  
  // Real-time features testing
  realtimePerformance: {
    websocketConnections: 10000,
    messageLatency: '<100ms',
    connectionStability: '>99.9%'
  },
  
  // Database performance
  databaseOptimization: {
    queryPerformance: '<50ms average',
    concurrentConnections: 500,
    dataConsistency: '100%'
  }
};
```

---

## **🚀 PRODUCTION DEPLOYMENT CHECKLIST**

### **1. Security Hardening**
```typescript
const SecurityMeasures = {
  dataProtection: {
    encryption: 'AES-256 for sensitive data',
    tokenSecurity: 'JWT with rotation',
    apiSecurity: 'Rate limiting + DDoS protection',
    userPrivacy: 'GDPR + CCPA compliant'
  },
  
  infrastructure: {
    serverSecurity: 'SSL/TLS 1.3',
    databaseSecurity: 'Encrypted at rest + in transit',
    backupStrategy: '3-2-1 backup rule',
    disasterRecovery: 'RTO: 4 hours, RPO: 1 hour'
  }
};
```

### **2. Monitoring & Observability**
```typescript
const MonitoringStack = {
  applicationMonitoring: {
    errors: 'Sentry',
    performance: 'New Relic',
    uptime: 'Pingdom',
    userBehavior: 'PostHog'
  },
  
  businessMetrics: {
    userEngagement: 'Custom dashboard',
    conversionRates: 'Mixpanel funnels',
    revenueTracking: 'Stripe Analytics',
    dreamSuccessRates: 'Custom ML pipeline'
  }
};
```

---

## **📊 SUCCESS METRICS & KPIs**

### **1. Product Metrics**
```typescript
interface SuccessMetrics {
  userEngagement: {
    dailyActiveUsers: number;
    sessionDuration: Duration;
    featureAdoption: PercentageByFeature;
    visionBoardCreation: CreationRate;
  };
  
  manifestationSuccess: {
    goalCompletionRate: Percentage;
    timeToFirstMilestone: Duration;
    userSatisfactionScore: NPS;
    dreamAchievementRate: Percentage;
  };
  
  businessMetrics: {
    monthlyRecurringRevenue: Currency;
    customerAcquisitionCost: Currency;
    lifetimeValue: Currency;
    churnRate: Percentage;
  };
}
```

### **2. A/B Testing Framework**
```typescript
class ExperimentationPlatform {
  async runManifestationExperiment(experiment: Experiment) {
    const variants = await this.createVariants(experiment.hypothesis);
    const userSegments = await this.segmentUsers(experiment.targetCriteria);
    
    return this.executeExperiment({
      variants,
      segments: userSegments,
      successMetrics: experiment.successMetrics,
      duration: experiment.duration,
      statisticalPower: 0.8
    });
  }
}
```

---

## **💎 PREMIUM FEATURES FOR MONETIZATION**

### **1. AI Manifestation Coach Pro**
```typescript
interface PremiumFeatures {
  personalizedCoaching: {
    oneOnOneAISessions: 'Unlimited',
    voiceCoaching: '24/7 availability',
    dreamAnalysis: 'Deep psychological insights',
    successPrediction: 'ML-powered forecasting'
  };
  
  advancedVisionBoards: {
    unlimitedBoards: true,
    collaborativeBoards: true,
    videoVisionBoards: true,
    arVisualization: true
  };
  
  communityAccess: {
    mastermindGroups: true,
    expertCoachAccess: true,
    exclusiveEvents: true,
    prioritySupport: true
  };
}
```

---

## **🏁 DEPLOYMENT INSTRUCTIONS**

### **Final Production Checklist:**

1. **Infrastructure Setup**
   - ✅ Deploy to Vercel (frontend) + Railway (backend)
   - ✅ Configure domain and SSL certificates
   - ✅ Set up monitoring and alerts
   - ✅ Configure backup systems

2. **Security Verification**
   - ✅ Security audit passed
   - ✅ Penetration testing completed
   - ✅ GDPR compliance verified
   - ✅ Data encryption validated

3. **Performance Optimization**
   - ✅ Lighthouse score >90
   - ✅ Core Web Vitals optimized
   - ✅ API response times <2s
   - ✅ Database queries optimized

4. **Business Operations**
   - ✅ Payment processing tested
   - ✅ Email systems configured
   - ✅ Customer support ready
   - ✅ Analytics tracking active

---

**🎯 RESULT: A production-ready, world-class AI manifestation platform that users will love and pay premium prices for, built with cutting-edge technology and designed for scale.**

