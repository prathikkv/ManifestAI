// Advanced NLP Dream Analysis Engine for ManifestAI
// Multi-layer processing with sentiment analysis, entity extraction, and intent recognition

export interface DreamAnalysis {
  // Core analysis
  primaryCategories: string[];
  emotionalTone: {
    sentiment: 'positive' | 'neutral' | 'negative';
    intensity: number; // 0-1
    emotions: string[]; // joy, excitement, fear, desire, etc.
  };
  
  // Entity extraction
  entities: {
    goals: string[];
    timeframes: string[];
    obstacles: string[];
    motivations: string[];
    values: string[];
  };
  
  // Intent recognition
  intent: {
    type: 'achievement' | 'transformation' | 'acquisition' | 'relationship' | 'experience';
    urgency: number; // 0-1
    specificity: number; // 0-1
    feasibility: number; // 0-1
  };
  
  // Personalization data
  personalization: {
    previousDreams: string[];
    successPatterns: string[];
    preferredImageStyles: string[];
    colorPreferences: string[];
  };
  
  // Content suggestions
  suggestions: {
    keywords: Array<{word: string; weight: number; category: string}>;
    imageQueries: string[];
    affirmations: string[];
    visualElements: string[];
  };
}

export interface Dream {
  id: string;
  title: string;
  description: string;
  whyImportant?: string;
  category: string;
  deadline?: Date;
  milestones?: string[];
  createdAt: Date;
  userId: string;
}

// Enhanced emotion mapping with intensity and associations
const emotionPatterns = {
  excitement: {
    keywords: ['excited', 'thrilled', 'amazing', 'incredible', 'fantastic', 'awesome', 'pumped'],
    intensity: 0.9,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    imageStyle: 'dynamic'
  },
  determination: {
    keywords: ['determined', 'focused', 'committed', 'dedicated', 'persistent', 'driven'],
    intensity: 0.8,
    colors: ['#96CEB4', '#FFEAA7', '#DDA0DD'],
    imageStyle: 'strong'
  },
  peace: {
    keywords: ['peaceful', 'calm', 'serene', 'tranquil', 'balanced', 'centered'],
    intensity: 0.6,
    colors: ['#A8E6CF', '#B8B8FF', '#FFD3A5'],
    imageStyle: 'serene'
  },
  ambition: {
    keywords: ['ambitious', 'successful', 'wealthy', 'powerful', 'influential', 'leader'],
    intensity: 0.9,
    colors: ['#FFD700', '#C0392B', '#2C3E50'],
    imageStyle: 'luxurious'
  },
  love: {
    keywords: ['love', 'romantic', 'connection', 'intimate', 'caring', 'devoted'],
    intensity: 0.8,
    colors: ['#FF69B4', '#FFB6C1', '#FFA07A'],
    imageStyle: 'warm'
  },
  adventure: {
    keywords: ['adventure', 'explore', 'travel', 'discover', 'freedom', 'wild'],
    intensity: 0.9,
    colors: ['#32CD32', '#87CEEB', '#F4A460'],
    imageStyle: 'expansive'
  }
};

// Advanced category mapping with deeper semantic understanding
const advancedCategoryMapping = {
  health_fitness: {
    primaryKeywords: ['health', 'fitness', 'weight', 'body', 'exercise', 'workout', 'gym', 'diet', 'nutrition'],
    semanticClusters: {
      weight_loss: ['lose weight', 'slim down', 'get lean', 'reduce fat', 'tone up'],
      muscle_building: ['build muscle', 'get strong', 'bulk up', 'gain mass', 'strength'],
      general_wellness: ['healthy lifestyle', 'feel good', 'energy', 'vitality', 'wellness'],
      athletic_performance: ['performance', 'compete', 'athlete', 'marathon', 'sports']
    },
    emotionalPatterns: ['determination', 'excitement'],
    timeframePatterns: ['summer body', 'new year', 'before wedding', 'beach ready'],
    visualElements: ['progress charts', 'before/after', 'workout scenes', 'healthy foods']
  },
  
  career_business: {
    primaryKeywords: ['career', 'job', 'business', 'work', 'professional', 'income', 'money', 'success'],
    semanticClusters: {
      career_advancement: ['promotion', 'leadership', 'manager', 'executive', 'senior'],
      entrepreneurship: ['startup', 'entrepreneur', 'business owner', 'company', 'venture'],
      financial_growth: ['wealth', 'rich', 'financial freedom', 'income', 'investment'],
      skill_development: ['learn', 'skills', 'certification', 'education', 'training']
    },
    emotionalPatterns: ['ambition', 'determination', 'excitement'],
    timeframePatterns: ['by 30', 'next year', 'five years', 'retirement'],
    visualElements: ['office scenes', 'success symbols', 'charts/graphs', 'money imagery']
  },
  
  relationships_love: {
    primaryKeywords: ['love', 'relationship', 'partner', 'marriage', 'family', 'friend', 'connection'],
    semanticClusters: {
      romantic_love: ['soulmate', 'husband', 'wife', 'boyfriend', 'girlfriend', 'dating'],
      family_bonds: ['children', 'kids', 'family', 'mother', 'father', 'parent'],
      social_connections: ['friends', 'community', 'network', 'social', 'belonging'],
      self_love: ['self-care', 'confidence', 'self-worth', 'self-acceptance']
    },
    emotionalPatterns: ['love', 'peace', 'excitement'],
    timeframePatterns: ['this year', 'before 35', 'soon', 'when ready'],
    visualElements: ['couples', 'families', 'hearts', 'weddings', 'intimate moments']
  },
  
  travel_adventure: {
    primaryKeywords: ['travel', 'adventure', 'explore', 'world', 'journey', 'vacation', 'trip'],
    semanticClusters: {
      world_travel: ['countries', 'continents', 'international', 'passport', 'culture'],
      nature_adventure: ['mountains', 'beach', 'forest', 'hiking', 'camping', 'outdoor'],
      luxury_travel: ['first class', 'resort', 'luxury', 'spa', 'fine dining'],
      spiritual_journey: ['pilgrimage', 'retreat', 'meditation', 'spiritual', 'enlightenment']
    },
    emotionalPatterns: ['adventure', 'excitement', 'peace'],
    timeframePatterns: ['next vacation', 'bucket list', 'retirement', 'gap year'],
    visualElements: ['landscapes', 'transportation', 'cultural sites', 'adventure scenes']
  },
  
  personal_growth: {
    primaryKeywords: ['growth', 'development', 'learn', 'improve', 'change', 'transform', 'mindset'],
    semanticClusters: {
      spiritual_growth: ['spiritual', 'meditation', 'enlightenment', 'consciousness', 'awakening'],
      mental_health: ['therapy', 'healing', 'mental health', 'anxiety', 'depression', 'peace'],
      habits_lifestyle: ['habits', 'routine', 'discipline', 'productivity', 'organization'],
      creativity: ['creative', 'art', 'music', 'writing', 'expression', 'artistic']
    },
    emotionalPatterns: ['peace', 'determination', 'excitement'],
    timeframePatterns: ['daily practice', 'this year', 'gradual change', 'lifetime journey'],
    visualElements: ['nature', 'meditation', 'books', 'art', 'symbols of growth']
  }
};

// Temporal pattern recognition
const timeframePatterns = {
  immediate: {
    keywords: ['now', 'today', 'immediately', 'asap', 'urgent'],
    weight: 1.0,
    urgency: 0.9
  },
  short_term: {
    keywords: ['week', 'month', 'soon', 'quickly', 'by summer'],
    weight: 0.8,
    urgency: 0.7
  },
  medium_term: {
    keywords: ['year', 'by 30', 'next year', 'eventually'],
    weight: 0.6,
    urgency: 0.5
  },
  long_term: {
    keywords: ['years', 'decade', 'lifetime', 'someday', 'retirement'],
    weight: 0.4,
    urgency: 0.3
  }
};

class AdvancedNLPEngine {
  private userHistory: Map<string, any[]> = new Map();
  private successPatterns: Map<string, string[]> = new Map();

  // Main analysis function
  analyzeDream(dream: Dream, userId: string = 'default'): DreamAnalysis {
    const dreamText = this.combineDreamText(dream);
    
    // Multi-layer analysis
    const sentiment = this.analyzeSentiment(dreamText);
    const entities = this.extractEntities(dreamText);
    const intent = this.recognizeIntent(dreamText, entities);
    const categories = this.detectCategories(dreamText, entities);
    const emotions = this.analyzeEmotions(dreamText);
    const personalization = this.getPersonalizationData(userId);
    const suggestions = this.generateSuggestions(dreamText, categories, emotions, entities);
    
    // Store for learning
    this.updateUserHistory(userId, dream, categories, emotions);
    
    return {
      primaryCategories: categories,
      emotionalTone: {
        sentiment: sentiment.polarity,
        intensity: sentiment.intensity,
        emotions: emotions.map(e => e.emotion)
      },
      entities,
      intent,
      personalization,
      suggestions
    };
  }

  // Combine all dream text for analysis
  private combineDreamText(dream: Dream): string {
    const parts = [
      dream.title,
      dream.description,
      dream.whyImportant || '',
      dream.category,
      ...(dream.milestones || [])
    ];
    return parts.join(' ').toLowerCase();
  }

  // Advanced sentiment analysis
  private analyzeSentiment(text: string): {polarity: 'positive' | 'neutral' | 'negative', intensity: number} {
    const positiveWords = [
      'amazing', 'awesome', 'fantastic', 'incredible', 'wonderful', 'excellent', 'perfect',
      'love', 'excited', 'thrilled', 'happy', 'joyful', 'successful', 'achieve', 'accomplish',
      'dream', 'goal', 'aspire', 'hope', 'want', 'desire', 'passionate', 'motivated'
    ];
    
    const negativeWords = [
      'hard', 'difficult', 'struggle', 'challenge', 'problem', 'issue', 'worry', 'fear',
      'anxious', 'stressed', 'overwhelmed', 'impossible', "can't", "won't", 'never'
    ];
    
    const words = text.split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    });
    
    const totalScore = positiveScore - negativeScore;
    const intensity = Math.min(Math.abs(totalScore) / words.length * 10, 1);
    
    let polarity: 'positive' | 'neutral' | 'negative';
    if (totalScore > 0) polarity = 'positive';
    else if (totalScore < 0) polarity = 'negative';
    else polarity = 'neutral';
    
    return { polarity, intensity };
  }

  // Extract entities from dream text
  private extractEntities(text: string): DreamAnalysis['entities'] {
    const timeRegex = /(\\d+)\\s*(day|week|month|year|decade)s?|by\\s+(\\d{4}|summer|winter|spring|fall)/gi;
    const goalRegex = /(achieve|accomplish|reach|attain|get|become|build|create|start|launch)\\s+([^.!?]+)/gi;
    const obstacleRegex = /(but|however|although|challenge|difficult|hard|struggle|problem)\\s+([^.!?]+)/gi;
    const motivationRegex = /(because|since|so that|in order to|want to|need to)\\s+([^.!?]+)/gi;
    
    const timeframes: string[] = [];
    const goals: string[] = [];
    const obstacles: string[] = [];
    const motivations: string[] = [];
    const values: string[] = [];
    
    let match;
    
    // Extract timeframes
    while ((match = timeRegex.exec(text)) !== null) {
      timeframes.push(match[0]);
    }
    
    // Extract goals
    while ((match = goalRegex.exec(text)) !== null) {
      goals.push(match[2].trim());
    }
    
    // Extract obstacles
    while ((match = obstacleRegex.exec(text)) !== null) {
      obstacles.push(match[2].trim());
    }
    
    // Extract motivations
    while ((match = motivationRegex.exec(text)) !== null) {
      motivations.push(match[2].trim());
    }
    
    // Extract values (simple keyword-based)
    const valueKeywords = ['family', 'freedom', 'security', 'creativity', 'adventure', 'success', 'health', 'love', 'peace', 'growth'];
    valueKeywords.forEach(value => {
      if (text.includes(value)) {
        values.push(value);
      }
    });
    
    return { goals, timeframes, obstacles, motivations, values };
  }

  // Recognize user intent
  private recognizeIntent(text: string, entities: DreamAnalysis['entities']): DreamAnalysis['intent'] {
    // Determine intent type
    let type: DreamAnalysis['intent']['type'] = 'achievement';
    
    if (text.includes('become') || text.includes('transform') || text.includes('change')) {
      type = 'transformation';
    } else if (text.includes('buy') || text.includes('get') || text.includes('own') || text.includes('have')) {
      type = 'acquisition';
    } else if (text.includes('meet') || text.includes('find') || text.includes('relationship') || text.includes('love')) {
      type = 'relationship';
    } else if (text.includes('experience') || text.includes('travel') || text.includes('adventure') || text.includes('feel')) {
      type = 'experience';
    }
    
    // Calculate urgency based on timeframes
    let urgency = 0.5;
    entities.timeframes.forEach(timeframe => {
      if (timeframe.includes('now') || timeframe.includes('immediately')) urgency = 0.9;
      else if (timeframe.includes('week') || timeframe.includes('month')) urgency = 0.7;
      else if (timeframe.includes('year')) urgency = 0.5;
      else urgency = 0.3;
    });
    
    // Calculate specificity based on detail level
    const wordCount = text.split(/\\s+/).length;
    const specificity = Math.min(wordCount / 100, 1);
    
    // Calculate feasibility (simplified heuristic)
    const feasibilityWords = ['realistic', 'achievable', 'possible', 'plan', 'step'];
    const challengeWords = ['impossible', 'unrealistic', 'difficult', 'hard'];
    let feasibility = 0.6; // default moderate feasibility
    
    feasibilityWords.forEach(word => {
      if (text.includes(word)) feasibility += 0.1;
    });
    challengeWords.forEach(word => {
      if (text.includes(word)) feasibility -= 0.1;
    });
    
    feasibility = Math.max(0.1, Math.min(1.0, feasibility));
    
    return { type, urgency, specificity, feasibility };
  }

  // Detect multiple categories for complex dreams
  private detectCategories(text: string, entities: DreamAnalysis['entities']): string[] {
    const categoryScores: Map<string, number> = new Map();
    
    // Score each category based on keyword matches and semantic clusters
    Object.entries(advancedCategoryMapping).forEach(([categoryKey, categoryData]) => {
      let score = 0;
      
      // Primary keyword matches
      categoryData.primaryKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          score += 2; // Higher weight for primary keywords
        }
      });
      
      // Semantic cluster matches
      Object.entries(categoryData.semanticClusters).forEach(([clusterKey, clusterKeywords]) => {
        clusterKeywords.forEach(phrase => {
          if (text.includes(phrase)) {
            score += 3; // Even higher weight for specific phrases
          }
        });
      });
      
      categoryScores.set(categoryKey, score);
    });
    
    // Return categories with score > 0, sorted by score
    return Array.from(categoryScores.entries())
      .filter(([_, score]) => score > 0)
      .sort(([_, a], [__, b]) => b - a)
      .map(([category, _]) => category);
  }

  // Analyze emotional patterns
  private analyzeEmotions(text: string): Array<{emotion: string, intensity: number, colors: string[], imageStyle: string}> {
    const detectedEmotions: Array<{emotion: string, intensity: number, colors: string[], imageStyle: string}> = [];
    
    Object.entries(emotionPatterns).forEach(([emotion, pattern]) => {
      let matchCount = 0;
      pattern.keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          matchCount++;
        }
      });
      
      if (matchCount > 0) {
        detectedEmotions.push({
          emotion,
          intensity: pattern.intensity * (matchCount / pattern.keywords.length),
          colors: pattern.colors,
          imageStyle: pattern.imageStyle
        });
      }
    });
    
    // If no emotions detected, default to excitement
    if (detectedEmotions.length === 0) {
      detectedEmotions.push({
        emotion: 'excitement',
        intensity: 0.7,
        colors: emotionPatterns.excitement.colors,
        imageStyle: emotionPatterns.excitement.imageStyle
      });
    }
    
    return detectedEmotions.sort((a, b) => b.intensity - a.intensity);
  }

  // Get personalization data for user
  private getPersonalizationData(userId: string): DreamAnalysis['personalization'] {
    const userHistory = this.userHistory.get(userId) || [];
    const successPatterns = this.successPatterns.get(userId) || [];
    
    // Extract patterns from user history
    const previousDreams = userHistory.map(h => h.category || '');
    const preferredImageStyles = userHistory
      .flatMap(h => h.emotions || [])
      .map(e => e.imageStyle || '')
      .filter(style => style !== '');
    
    const colorPreferences = userHistory
      .flatMap(h => h.emotions || [])
      .flatMap(e => e.colors || []);
    
    return {
      previousDreams,
      successPatterns,
      preferredImageStyles: [...new Set(preferredImageStyles)],
      colorPreferences: [...new Set(colorPreferences)]
    };
  }

  // Generate intelligent suggestions
  private generateSuggestions(text: string, categories: string[], emotions: any[], entities: DreamAnalysis['entities']): DreamAnalysis['suggestions'] {
    const keywords: Array<{word: string; weight: number; category: string}> = [];
    const imageQueries: string[] = [];
    const affirmations: string[] = [];
    const visualElements: string[] = [];
    
    // Generate keywords from categories and emotions
    categories.forEach(category => {
      const categoryData = advancedCategoryMapping[category as keyof typeof advancedCategoryMapping];
      if (categoryData) {
        // Add primary keywords
        categoryData.primaryKeywords.forEach(keyword => {
          keywords.push({ word: keyword, weight: 0.8, category });
        });
        
        // Add visual elements
        visualElements.push(...categoryData.visualElements);
      }
    });
    
    // Generate emotion-based image queries
    emotions.forEach(emotion => {
      imageQueries.push(`${emotion.emotion} ${emotion.imageStyle}`);
      if (emotion.emotion === 'adventure') {
        imageQueries.push('outdoor adventure', 'mountain landscape', 'travel destination');
      } else if (emotion.emotion === 'ambition') {
        imageQueries.push('success lifestyle', 'luxury office', 'achievement trophy');
      } else if (emotion.emotion === 'love') {
        imageQueries.push('romantic couple', 'heart symbol', 'wedding inspiration');
      }
    });
    
    // Generate personalized affirmations
    entities.goals.forEach(goal => {
      affirmations.push(`I am successfully ${goal.toLowerCase()}`);
      affirmations.push(`${goal} flows easily into my life`);
    });
    
    // Add category-specific affirmations
    if (categories.includes('health_fitness')) {
      affirmations.push('My body is strong and healthy', 'I choose nourishing foods and movement');
    }
    if (categories.includes('career_business')) {
      affirmations.push('Success comes naturally to me', 'I am a leader and innovator');
    }
    if (categories.includes('relationships_love')) {
      affirmations.push('I attract loving relationships', 'I am worthy of deep connection');
    }
    
    return { keywords, imageQueries, affirmations, visualElements };
  }

  // Update user history for learning
  private updateUserHistory(userId: string, dream: Dream, categories: string[], emotions: any[]): void {
    const userHistory = this.userHistory.get(userId) || [];
    userHistory.push({
      dreamId: dream.id,
      categories,
      emotions,
      timestamp: new Date(),
      title: dream.title
    });
    
    // Keep only last 50 dreams for performance
    if (userHistory.length > 50) {
      userHistory.splice(0, userHistory.length - 50);
    }
    
    this.userHistory.set(userId, userHistory);
  }

  // Mark a dream as successfully manifested for learning
  markDreamAsSuccessful(userId: string, dreamId: string, successFactors: string[]): void {
    const successPatterns = this.successPatterns.get(userId) || [];
    successPatterns.push(...successFactors);
    this.successPatterns.set(userId, successPatterns);
  }

  // Get success recommendations based on patterns
  getSuccessRecommendations(userId: string): string[] {
    const successPatterns = this.successPatterns.get(userId) || [];
    const patternCounts = new Map<string, number>();
    
    successPatterns.forEach(pattern => {
      patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
    });
    
    return Array.from(patternCounts.entries())
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 5)
      .map(([pattern, _]) => pattern);
  }
}

// Export singleton instance
export const nlpEngine = new AdvancedNLPEngine();

// Export additional utilities
export { emotionPatterns, advancedCategoryMapping, timeframePatterns };