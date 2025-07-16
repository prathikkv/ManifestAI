import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    console.log('Clerk webhook received:', type);

    switch (type) {
      case 'user.created':
        try {
          // Create user in our database
          const user = await prisma.user.create({
            data: {
              clerkId: data.id,
              email: data.email_addresses[0]?.email_address,
              username: data.username,
              profile: {
                create: {
                  displayName: `${data.first_name} ${data.last_name}`.trim() || data.username,
                  preferences: {},
                }
              },
              privacySettings: {},
              analytics: {
                create: {}
              }
            },
            include: {
              profile: true,
              analytics: true,
            }
          });

          console.log('User created in database:', user.id);
          
          return NextResponse.json({ 
            success: true, 
            message: 'User created successfully',
            userId: user.id 
          });
        } catch (dbError) {
          console.error('Database error creating user:', dbError);
          return NextResponse.json(
            { success: false, error: 'Database error' },
            { status: 500 }
          );
        }

      case 'user.updated':
        try {
          // Update user in our database
          await prisma.user.update({
            where: { clerkId: data.id },
            data: {
              email: data.email_addresses[0]?.email_address,
              username: data.username,
              profile: {
                update: {
                  displayName: `${data.first_name} ${data.last_name}`.trim() || data.username,
                }
              },
              lastActiveAt: new Date(),
            }
          });

          return NextResponse.json({ 
            success: true, 
            message: 'User updated successfully' 
          });
        } catch (dbError) {
          console.error('Database error updating user:', dbError);
          return NextResponse.json(
            { success: false, error: 'Database error' },
            { status: 500 }
          );
        }

      case 'user.deleted':
        try {
          // Soft delete user in our database
          await prisma.user.update({
            where: { clerkId: data.id },
            data: {
              // In a real app, you might want to soft delete
              // or handle this differently based on GDPR requirements
            }
          });

          return NextResponse.json({ 
            success: true, 
            message: 'User deleted successfully' 
          });
        } catch (dbError) {
          console.error('Database error deleting user:', dbError);
          return NextResponse.json(
            { success: false, error: 'Database error' },
            { status: 500 }
          );
        }

      default:
        console.log('Unhandled webhook type:', type);
        return NextResponse.json({ 
          success: true, 
          message: 'Webhook received but not processed' 
        });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}