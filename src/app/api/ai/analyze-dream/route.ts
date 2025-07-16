import { NextRequest, NextResponse } from 'next/server';
import { analyzeDream } from '@/lib/openai';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { dreamText } = body;

    if (!dreamText || typeof dreamText !== 'string') {
      return NextResponse.json(
        { error: 'Dream text is required' },
        { status: 400 }
      );
    }

    // Analyze the dream with AI
    const analysis = await analyzeDream(dreamText);

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Dream analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze dream',
        fallback: {
          themes: ['Personal growth'],
          challenges: ['Staying motivated'],
          actionSteps: ['Start with small daily actions'],
          readiness: 'You\'re ready to begin this journey!',
          timeline: 'Visible progress within 2-4 weeks'
        }
      },
      { status: 500 }
    );
  }
}