// WhatsApp Business API Webhook Handler
// Handles incoming messages and user interactions

import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp-notifications';

// Verify webhook URL (required by WhatsApp)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'manifestai_webhook_token';
  
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ WhatsApp webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.error('❌ WhatsApp webhook verification failed');
    return new NextResponse('Forbidden', { status: 403 });
  }
}

// Handle incoming WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📱 WhatsApp webhook received:', JSON.stringify(body, null, 2));
    
    // Verify webhook signature (optional but recommended for production)
    const signature = request.headers.get('x-hub-signature-256');
    if (signature && !verifyWebhookSignature(JSON.stringify(body), signature)) {
      console.error('❌ Invalid webhook signature');
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Process the webhook
    await whatsappService.handleWebhook(body);
    
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('❌ WhatsApp webhook error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Verify webhook signature for security
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const crypto = require('crypto');
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  
  if (!appSecret) {
    console.warn('⚠️ WHATSAPP_APP_SECRET not configured');
    return true; // Skip verification in development
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', appSecret)
    .update(payload, 'utf8')
    .digest('hex');
  
  const signatureHash = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signatureHash, 'hex')
  );
}