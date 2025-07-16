import { NextRequest, NextResponse } from 'next/server';
import { generateManifestationAdvice } from '@/lib/openai';
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
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate AI response
    const response = await generateManifestationAdvice(message, context);

    // In a real app, you'd save this conversation to the database
    // await prisma.aiConversation.create({ ... })

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('AI chat error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        fallback: 'I\'m here to help you manifest your dreams! Could you tell me more about what you\'re working on?'
      },
      { status: 500 }
    );
  }
}