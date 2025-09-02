import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import NotificationEngine, { NotificationType, NotificationContext } from '@/lib/notifications/NotificationEngine';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      recipientIds,
      notificationType,
      context,
      customMessage,
      customTitle
    }: {
      recipientIds: string[];
      notificationType: NotificationType;
      context: NotificationContext;
      customMessage?: string;
      customTitle?: string;
    } = body;

    // Validate required fields
    if (!recipientIds || !Array.isArray(recipientIds) || recipientIds.length === 0) {
      return NextResponse.json(
        { error: 'recipientIds is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    if (!notificationType) {
      return NextResponse.json(
        { error: 'notificationType is required' },
        { status: 400 }
      );
    }

    // Send notifications
    const notificationEngine = NotificationEngine.getInstance();
    const notifications = await notificationEngine.sendNotification(
      recipientIds,
      notificationType,
      context,
      customMessage,
      customTitle
    );

    return NextResponse.json({
      success: true,
      data: {
        notificationsSent: notifications.length,
        notifications: notifications.map(n => ({
          id: n.id,
          recipientId: n.recipientId,
          status: n.status,
          channels: n.channels.length
        }))
      }
    });

  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    // Get notification history
    const notificationEngine = NotificationEngine.getInstance();
    const history = await notificationEngine.getNotificationHistory(userId);

    return NextResponse.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error('Error fetching notification history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
