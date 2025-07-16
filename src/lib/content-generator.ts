// AI Content Generator for ManifestAI Vision Boards
// Generates personalized affirmations, quotes, and motivational content

export interface GeneratedContent {
  affirmations: string[];
  quotes: string[];
  actionSteps: string[];
  milestones: string[];
  successMetrics: string[];
  visualCues: string[];
}

export interface ContentRequest {
  dreamTitle: string;
  dreamDescription: string;
  category: string;
  emotionalTone: string;
  timeframe?: string;
  userGender?: string;
  personalValues?: string[];
  previousSuccesses?: string[];
}

// Curated motivational quotes by category and emotion
const motivationalQuotes = {
  health_fitness: {
    success: [
      "Your body can do it. It's your mind you have to convince.",
      "The groundwork for all happiness is good health.",
      "Take care of your body. It's the only place you have to live.",
      "Health is not about the weight you lose, but about the life you gain.",
      "Your fitness is 100% mental. Your body won't go where your mind doesn't push it."
    ],
    determination: [
      "Success isn't given. It's earned in the gym.",
      "The pain you feel today will be the strength you feel tomorrow.",
      "Don't stop when you're tired. Stop when you're done.",
      "Your limitation—it's only your imagination.",
      "Push yourself because no one else is going to do it for you."
    ],
    transformation: [
      "Every workout is progress, no matter how small.",
      "Change happens when you decide you are worth the effort.",
      "Your body is your temple. Keep it pure and clean for the soul to reside in.",
      "Transformation isn't a future event. It's a present activity.",
      "The best project you'll ever work on is you."
    ]
  },
  
  career_business: {
    success: [
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "The way to get started is to quit talking and begin doing.",
      "Innovation distinguishes between a leader and a follower.",
      "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
      "The future belongs to those who believe in the beauty of their dreams."
    ],
    leadership: [
      "A leader is one who knows the way, goes the way, and shows the way.",
      "The greatest leader is not necessarily the one who does the greatest things. He is the one that gets the people to do the greatest things.",
      "Leadership is not about being in charge. It's about taking care of those in your charge.",
      "The art of leadership is saying no, not saying yes. It is very easy to say yes.",
      "Great leaders are willing to sacrifice their own interests for the good of the team."
    ],
    entrepreneurship: [
      "The biggest risk is not taking any risk.",
      "Ideas are easy. Implementation is hard.",
      "Don't be afraid to give up the good to go for the great.",
      "The way to get started is to quit talking and begin doing.",
      "Your most unhappy customers are your greatest source of learning."
    ]
  },
  
  relationships_love: {
    self_love: [
      "You yourself, as much as anybody in the entire universe, deserve your love and affection.",
      "To love oneself is the beginning of a lifelong romance.",
      "You are enough just as you are.",
      "Love yourself first and everything else falls into line.",
      "The relationship with yourself sets the tone for every other relationship you have."
    ],
    romantic_love: [
      "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
      "The best love is the kind that awakens the soul and makes us reach for more.",
      "Love is not about how much you say 'I love you,' but how much you prove that it's true.",
      "In all the world, there is no heart for me like yours.",
      "Love is friendship that has caught fire."
    ],
    family: [
      "Family is not an important thing, it's everything.",
      "The love of a family is life's greatest blessing.",
      "Family means no one gets left behind or forgotten.",
      "A happy family is but an earlier heaven.",
      "Family is where life begins and love never ends."
    ]
  },
  
  travel_adventure: {
    wanderlust: [
      "Travel is the only thing you buy that makes you richer.",
      "Adventure is worthwhile in itself.",
      "To travel is to live.",
      "The world is a book and those who do not travel read only one page.",
      "Life is short and the world is wide."
    ],
    freedom: [
      "Adventure awaits, go find it.",
      "Collect moments, not things.",
      "The journey not the arrival matters.",
      "Travel far enough, you meet yourself.",
      "Don't listen to what they say. Go see."
    ]
  },
  
  personal_growth: {
    wisdom: [
      "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
      "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
      "The greatest revolution of our generation is the discovery that human beings, by changing the inner attitudes of their minds, can change the outer aspects of their lives.",
      "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
      "Be yourself; everyone else is already taken."
    ],
    transformation: [
      "The cave you fear to enter holds the treasure you seek.",
      "You are never too old to set another goal or to dream a new dream.",
      "The only impossible journey is the one you never begin.",
      "Change is the end result of all true learning.",
      "Growth begins at the end of your comfort zone."
    ]
  }
};

// Affirmation templates by category
const affirmationTemplates = {
  health_fitness: [
    "I am becoming healthier and stronger every day",
    "My body is capable of amazing things",
    "I choose foods that nourish and energize me",
    "I am committed to my health and well-being",
    "Every workout makes me more confident",
    "I love and respect my body",
    "Healthy choices come naturally to me",
    "I am transforming my body with love and patience"
  ],
  
  career_business: [
    "I am successful in everything I do",
    "Opportunities flow to me effortlessly",
    "I am a natural leader and innovator",
    "My skills and talents are valued and recognized",
    "I attract abundance through my work",
    "I make decisions with confidence and clarity",
    "Success is my natural state",
    "I am creating the career of my dreams"
  ],
  
  relationships_love: [
    "I am worthy of deep, meaningful love",
    "I attract loving, healthy relationships",
    "Love flows freely in my life",
    "I communicate with love and understanding",
    "My heart is open to true connection",
    "I am surrounded by people who support me",
    "I love and accept myself completely",
    "Healthy relationships are natural for me"
  ],
  
  travel_adventure: [
    "The world is full of amazing experiences waiting for me",
    "I am free to explore and discover",
    "Adventure calls and I answer",
    "I create incredible memories wherever I go",
    "Travel enriches my soul and expands my mind",
    "I am brave and curious about the world",
    "Every journey teaches me something new",
    "I embrace new cultures and experiences"
  ],
  
  personal_growth: [
    "I am constantly growing and evolving",
    "I embrace change as an opportunity for growth",
    "I am becoming the best version of myself",
    "I learn from every experience",
    "I am wise, confident, and self-aware",
    "I trust my intuition and inner wisdom",
    "I am at peace with who I am becoming",
    "Growth and transformation are natural for me"
  ]
};

// Success metrics and milestone templates
const successMetrics = {
  health_fitness: [
    "Energy levels: High throughout the day",
    "Strength: Can lift [X] pounds",
    "Endurance: Can run [X] miles",
    "Weight: Reach [X] pounds",
    "Body fat: Achieve [X]% body fat",
    "Sleep: 7-8 hours of quality sleep",
    "Nutrition: 5 servings of vegetables daily",
    "Consistency: Workout 4-5 times per week"
  ],
  
  career_business: [
    "Income: Earn $[X] per year",
    "Position: Promoted to [X] role",
    "Skills: Master [X] new competencies",
    "Network: Connect with [X] industry leaders",
    "Revenue: Generate $[X] in sales",
    "Team: Lead a team of [X] people",
    "Recognition: Win [X] award",
    "Growth: Expand into [X] markets"
  ],
  
  relationships_love: [
    "Communication: Daily meaningful conversations",
    "Quality time: [X] hours together per week",
    "Intimacy: Deep emotional connection",
    "Support: Mutual encouragement and growth",
    "Fun: Regular date nights and adventures",
    "Trust: Complete honesty and transparency",
    "Future: Shared goals and vision",
    "Love: Express appreciation daily"
  ],
  
  travel_adventure: [
    "Destinations: Visit [X] new countries",
    "Experiences: Try [X] new activities",
    "Budget: Save $[X] for travel",
    "Duration: Take [X] week adventures",
    "Culture: Learn about [X] traditions",
    "Language: Speak basic [X] language",
    "Memories: Document journey in [X] ways",
    "Growth: Step outside comfort zone [X] times"
  ],
  
  personal_growth: [
    "Mindfulness: Meditate [X] minutes daily",
    "Learning: Read [X] books per month",
    "Skills: Develop [X] new abilities",
    "Habits: Maintain [X] positive routines",
    "Reflection: Journal [X] times per week",
    "Goals: Achieve [X] major milestones",
    "Relationships: Deepen [X] connections",
    "Peace: Reduce stress by [X]%"
  ]
};

class ContentGenerator {
  // Main content generation function
  generateContent(request: ContentRequest): GeneratedContent {
    const { category, emotionalTone, dreamTitle, dreamDescription } = request;
    
    return {
      affirmations: this.generatePersonalizedAffirmations(request),
      quotes: this.selectRelevantQuotes(category, emotionalTone),
      actionSteps: this.generateActionSteps(request),
      milestones: this.generateMilestones(request),
      successMetrics: this.generateSuccessMetrics(request),
      visualCues: this.generateVisualCues(request)
    };
  }

  // Generate personalized affirmations
  private generatePersonalizedAffirmations(request: ContentRequest): string[] {
    const { category, dreamTitle, dreamDescription, userGender } = request;
    const baseAffirmations = affirmationTemplates[category as keyof typeof affirmationTemplates] || affirmationTemplates.personal_growth;
    
    // Personalize affirmations
    const personalizedAffirmations = baseAffirmations.map(affirmation => {
      // Replace generic terms with specific dream elements
      let personalized = affirmation;
      
      // Gender-specific pronouns if provided
      if (userGender) {
        // This could be enhanced with more sophisticated gender-inclusive language
        personalized = personalized.replace(/\bI am\b/g, 'I am');
      }
      
      // Incorporate dream-specific language
      if (dreamTitle.toLowerCase().includes('weight')) {
        personalized = personalized.replace('healthier', 'at my ideal weight');
      }
      
      if (dreamTitle.toLowerCase().includes('business')) {
        personalized = personalized.replace('successful', 'a successful entrepreneur');
      }
      
      return personalized;
    });
    
    // Add dream-specific affirmations
    const dreamSpecific = [
      `I am manifesting ${dreamTitle.toLowerCase()} with ease`,
      `${dreamTitle} is already mine in divine timing`,
      `I am worthy of achieving ${dreamTitle.toLowerCase()}`,
      `Every day brings me closer to ${dreamTitle.toLowerCase()}`
    ];
    
    return [...personalizedAffirmations.slice(0, 4), ...dreamSpecific.slice(0, 2)];
  }

  // Select relevant quotes based on category and emotion
  private selectRelevantQuotes(category: string, emotionalTone: string): string[] {
    const categoryQuotes = motivationalQuotes[category as keyof typeof motivationalQuotes];
    
    if (!categoryQuotes) {
      return motivationalQuotes.personal_growth.wisdom.slice(0, 3);
    }
    
    // Try to match emotional tone to quote subcategory
    const toneMapping = {
      'success': 'success',
      'determination': 'determination',
      'transformation': 'transformation',
      'leadership': 'leadership',
      'love': 'romantic_love',
      'self_love': 'self_love',
      'wisdom': 'wisdom',
      'freedom': 'freedom',
      'wanderlust': 'wanderlust'
    };
    
    const subCategory = toneMapping[emotionalTone as keyof typeof toneMapping] || Object.keys(categoryQuotes)[0];
    const quotes = categoryQuotes[subCategory as keyof typeof categoryQuotes] || Object.values(categoryQuotes)[0];
    
    return quotes.slice(0, 3);
  }

  // Generate actionable steps
  private generateActionSteps(request: ContentRequest): string[] {
    const { category, dreamDescription, timeframe } = request;
    
    const actionStepTemplates = {
      health_fitness: [
        "Create a weekly workout schedule",
        "Plan healthy meals for the week",
        "Track daily water intake",
        "Set up a morning routine",
        "Find an accountability partner",
        "Measure progress weekly",
        "Research healthy recipes",
        "Schedule regular check-ins"
      ],
      
      career_business: [
        "Update resume and LinkedIn profile",
        "Network with industry professionals",
        "Develop key skills through courses",
        "Set monthly performance goals",
        "Research target companies",
        "Practice interview skills",
        "Build a professional portfolio",
        "Seek mentorship opportunities"
      ],
      
      relationships_love: [
        "Practice active listening daily",
        "Schedule regular quality time",
        "Express gratitude and appreciation",
        "Work on personal growth",
        "Communicate needs clearly",
        "Plan meaningful experiences",
        "Show affection in their love language",
        "Create relationship rituals"
      ],
      
      travel_adventure: [
        "Research destinations and costs",
        "Create a travel savings plan",
        "Apply for necessary documents",
        "Learn basic local language",
        "Book accommodations in advance",
        "Create a flexible itinerary",
        "Pack efficiently and smart",
        "Document the journey"
      ],
      
      personal_growth: [
        "Establish a daily meditation practice",
        "Read personal development books",
        "Keep a gratitude journal",
        "Set weekly reflection time",
        "Practice new skills regularly",
        "Seek feedback from others",
        "Challenge limiting beliefs",
        "Celebrate small wins"
      ]
    };
    
    const steps = actionStepTemplates[category as keyof typeof actionStepTemplates] || actionStepTemplates.personal_growth;
    
    // Prioritize based on timeframe
    if (timeframe?.includes('immediate') || timeframe?.includes('week')) {
      return steps.slice(0, 3); // Fewer, more focused steps
    } else if (timeframe?.includes('month')) {
      return steps.slice(0, 5);
    } else {
      return steps.slice(0, 7);
    }
  }

  // Generate milestone markers
  private generateMilestones(request: ContentRequest): string[] {
    const { category, timeframe } = request;
    
    const milestoneTemplates = {
      health_fitness: [
        "Week 1: Establish consistent routine",
        "Month 1: See initial improvements",
        "Month 3: Reach first major goal",
        "Month 6: Lifestyle fully integrated",
        "Year 1: Maintain long-term success"
      ],
      
      career_business: [
        "Month 1: Complete skill assessment",
        "Month 3: Network with 10 professionals",
        "Month 6: Apply for target positions",
        "Month 9: Secure desired role",
        "Year 1: Excel in new position"
      ],
      
      relationships_love: [
        "Week 2: Improve daily communication",
        "Month 1: Establish new routines",
        "Month 3: Deepen emotional connection",
        "Month 6: Navigate challenges together",
        "Year 1: Build strong foundation"
      ],
      
      travel_adventure: [
        "Month 1: Complete trip research",
        "Month 3: Save 50% of travel fund",
        "Month 6: Book flights and accommodation",
        "Month 9: Complete trip preparation",
        "Month 12: Experience the adventure"
      ],
      
      personal_growth: [
        "Week 2: Daily practice established",
        "Month 1: Notice positive changes",
        "Month 3: Overcome major obstacle",
        "Month 6: Integrate new habits",
        "Year 1: Transform completely"
      ]
    };
    
    const milestones = milestoneTemplates[category as keyof typeof milestoneTemplates] || milestoneTemplates.personal_growth;
    
    // Adjust timeline based on user timeframe
    if (timeframe?.includes('year')) {
      return milestones;
    } else if (timeframe?.includes('month')) {
      return milestones.slice(0, 3);
    } else {
      return milestones.slice(0, 2);
    }
  }

  // Generate success metrics
  private generateSuccessMetrics(request: ContentRequest): string[] {
    const { category } = request;
    const metrics = successMetrics[category as keyof typeof successMetrics] || successMetrics.personal_growth;
    
    return metrics.slice(0, 4);
  }

  // Generate visual cues and symbols
  private generateVisualCues(request: ContentRequest): string[] {
    const { category, emotionalTone } = request;
    
    const visualCueTemplates = {
      health_fitness: [
        "Progress photos side by side",
        "Healthy meal preparation images",
        "Workout achievement charts",
        "Before and after measurements",
        "Active lifestyle photos",
        "Strength and flexibility poses"
      ],
      
      career_business: [
        "Professional headshot",
        "Success charts and graphs",
        "Inspirational office space",
        "Achievement certificates",
        "Networking event photos",
        "Leadership in action shots"
      ],
      
      relationships_love: [
        "Happy couple moments",
        "Meaningful conversation scenes",
        "Shared activity photos",
        "Expressions of love",
        "Future planning visuals",
        "Intimate and caring gestures"
      ],
      
      travel_adventure: [
        "Dream destination photos",
        "Adventure activity shots",
        "Cultural experience images",
        "Travel preparation scenes",
        "Journey documentation",
        "Exploration and discovery"
      ],
      
      personal_growth: [
        "Meditation and mindfulness",
        "Learning and education",
        "Self-reflection moments",
        "Growth and transformation",
        "Peaceful and centered states",
        "Wisdom and enlightenment"
      ]
    };
    
    const cues = visualCueTemplates[category as keyof typeof visualCueTemplates] || visualCueTemplates.personal_growth;
    
    return cues.slice(0, 4);
  }

  // Generate time-based reminders and check-ins
  generateReminders(request: ContentRequest): string[] {
    const { category, timeframe } = request;
    
    const reminderTemplates = [
      "Review progress weekly",
      "Celebrate small wins daily",
      "Adjust strategy monthly",
      "Visualize success morning and evening",
      "Practice gratitude for current progress",
      "Connect with accountability partner",
      "Document journey with photos/notes",
      "Reflect on lessons learned"
    ];
    
    return reminderTemplates.slice(0, 4);
  }

  // Generate personalized mantras
  generateMantras(request: ContentRequest): string[] {
    const { dreamTitle, emotionalTone } = request;
    
    const mantras = [
      `I am ${dreamTitle.toLowerCase()}`,
      `${dreamTitle} flows to me effortlessly`,
      `I deserve ${dreamTitle.toLowerCase()}`,
      `${dreamTitle} is my reality now`,
      `I am grateful for ${dreamTitle.toLowerCase()}`
    ];
    
    return mantras;
  }

  // Generate category-specific power words
  generatePowerWords(category: string): string[] {
    const powerWords = {
      health_fitness: ["STRONG", "VIBRANT", "HEALTHY", "ENERGIZED", "TRANSFORMED"],
      career_business: ["SUCCESS", "LEADERSHIP", "INNOVATION", "EXCELLENCE", "ACHIEVEMENT"],
      relationships_love: ["LOVE", "CONNECTION", "HARMONY", "DEVOTION", "PARTNERSHIP"],
      travel_adventure: ["ADVENTURE", "FREEDOM", "DISCOVERY", "WANDERLUST", "EXPLORATION"],
      personal_growth: ["WISDOM", "GROWTH", "TRANSFORMATION", "ENLIGHTENMENT", "PEACE"]
    };
    
    return powerWords[category as keyof typeof powerWords] || powerWords.personal_growth;
  }
}

// Export singleton instance
export const contentGenerator = new ContentGenerator();

// Export templates for customization
export { motivationalQuotes, affirmationTemplates, successMetrics };