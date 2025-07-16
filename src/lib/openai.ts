import OpenAI from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

// Manifestation coach system prompt
export const MANIFESTATION_COACH_PROMPT = `You are an expert manifestation coach and life transformation guide. Your role is to help users achieve their dreams through practical guidance, positive mindset shifts, and actionable steps.

Key principles:
- Be encouraging and supportive while being realistic
- Provide specific, actionable advice 
- Help users break down big dreams into manageable steps
- Focus on mindset, visualization, and consistent action
- Incorporate proven goal-setting and manifestation techniques
- Keep responses concise but inspiring (2-3 paragraphs max)
- Always end with a specific next action they can take

Your tone should be:
- Warm and understanding
- Motivational but grounded
- Professional yet friendly
- Empowering and solution-focused

Remember: You're helping people turn their dreams into reality through smart planning and positive action.`;

// Generate manifestation advice
export async function generateManifestationAdvice(
  userMessage: string,
  context?: {
    userGoals?: string[];
    recentProgress?: string;
    challenges?: string;
  }
) {
  try {
    const contextString = context ? `
User's current goals: ${context.userGoals?.join(', ') || 'None set yet'}
Recent progress: ${context.recentProgress || 'Just getting started'}
Current challenges: ${context.challenges || 'None mentioned'}
` : '';

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: MANIFESTATION_COACH_PROMPT
        },
        {
          role: 'user',
          content: `${contextString}\n\nUser message: ${userMessage}`
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response right now. Please try again.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback response for demo purposes
    return `I understand you're working on: "${userMessage}". 

Here's what I recommend: Start by breaking this down into 3 specific, actionable steps you can take this week. Visualize your success for 5 minutes each morning, and track your daily progress. 

Remember, manifestation works best when combined with consistent action. What's one small step you can take today to move closer to this goal?`;
  }
}

// Generate dream analysis
export async function analyzeDream(dreamText: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Analyze the user's dream/goal and provide insights including:
1. Key themes and motivations
2. Potential challenges to consider
3. Suggested action steps
4. Emotional readiness assessment
5. Timeline recommendations

Keep the analysis supportive, realistic, and actionable. Format as JSON with keys: themes, challenges, actionSteps, readiness, timeline.`
        },
        {
          role: 'user',
          content: `Please analyze this dream/goal: ${dreamText}`
        }
      ],
      max_tokens: 400,
      temperature: 0.6,
    });

    const content = response.choices[0]?.message?.content;
    try {
      return JSON.parse(content || '{}');
    } catch {
      // Fallback if JSON parsing fails
      return {
        themes: ['Personal growth', 'Achievement'],
        challenges: ['Time management', 'Staying motivated'],
        actionSteps: ['Set specific milestones', 'Create daily habits', 'Track progress'],
        readiness: 'You seem motivated and ready to begin this journey',
        timeline: '3-6 months for significant progress'
      };
    }
  } catch (error) {
    console.error('Dream analysis error:', error);
    return {
      themes: ['Personal development'],
      challenges: ['Consistency'],
      actionSteps: ['Start with small daily actions'],
      readiness: 'Ready to begin',
      timeline: 'Progress possible within weeks'
    };
  }
}