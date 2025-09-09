import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reportId, feature = 'pdf_download' } = await request.json();

    // Get user information
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        accountType: true,
        // Add any subscription/payment fields here
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check access permissions
    const accessCheck = await checkFeatureAccess(user, feature);

    return NextResponse.json({
      success: true,
      hasAccess: accessCheck.hasAccess,
      reason: accessCheck.reason,
      isDemo: accessCheck.isDemo,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        accountType: user.accountType
      }
    });

  } catch (error) {
    console.error('Access check error:', error);
    return NextResponse.json({
      error: 'Access check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function checkFeatureAccess(user: any, feature: string) {
  // Demo accounts - allow all features for now
  if (isDemoAccount(user)) {
    return {
      hasAccess: true,
      reason: 'Demo account - full access granted',
      isDemo: true
    };
  }

  // Admin users - always have access
  if (user.role === 'ADMIN') {
    return {
      hasAccess: true,
      reason: 'Admin user - full access',
      isDemo: false
    };
  }

  // Check specific feature access
  switch (feature) {
    case 'pdf_download':
      return await checkPDFDownloadAccess(user);
    case 'detailed_analytics':
      return await checkAnalyticsAccess(user);
    default:
      return {
        hasAccess: false,
        reason: 'Unknown feature',
        isDemo: false
      };
  }
}

function isDemoAccount(user: any): boolean {
  // Check if it's a demo account
  const demoEmails = [
    'parent@demo.com',
    'teacher@demo.com', 
    'admin@demo.com',
    'student@demo.com',
    'school-admin@demo.com'
  ];
  
  return demoEmails.includes(user.email) || user.email.includes('demo');
}

async function checkPDFDownloadAccess(user: any) {
  // DEVELOPMENT MODE: Allow all users to download PDFs without payment
  console.log('🔓 DEV MODE: Allowing PDF download for all users');
  
  return {
    hasAccess: true,
    reason: 'Development mode - free downloads enabled',
    isDemo: false
  };

  // ORIGINAL PAYMENT LOGIC (DISABLED FOR DEV)
  // // For now, allow PDF downloads for demo accounts and paid users
  // // In a real implementation, you would check subscription status, payment history, etc.
  // 
  // // Check if user has active subscription (placeholder logic)
  // const hasActiveSubscription = await checkSubscriptionStatus(user.id);
  // 
  // if (hasActiveSubscription) {
  //   return {
  //     hasAccess: true,
  //     reason: 'Active subscription',
  //     isDemo: false
  //   };
  // }

  // // Check if user has made payment for this specific report
  // const hasPaidForReport = await checkReportPayment(user.id);
  // 
  // if (hasPaidForReport) {
  //   return {
  //     hasAccess: true,
  //     reason: 'Paid for report access',
  //     isDemo: false
  //   };
  // }

  // return {
  //   hasAccess: false,
  //   reason: 'PDF download requires subscription or payment',
  //   isDemo: false
  // };
}

async function checkAnalyticsAccess(user: any) {
  // Similar logic for analytics access
  return {
    hasAccess: true, // For now, allow analytics for all authenticated users
    reason: 'Basic analytics included',
    isDemo: false
  };
}

async function checkSubscriptionStatus(userId: string): Promise<boolean> {
  // Placeholder - implement actual subscription checking logic
  // This would typically check:
  // - Stripe subscription status
  // - Subscription expiry dates
  // - Trial periods
  // - Payment history
  
  try {
    // For demo purposes, return true for now
    // In real implementation:
    /*
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
        expiresAt: {
          gte: new Date()
        }
      }
    });
    
    return !!subscription;
    */
    
    return false; // No active subscription by default
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

async function checkReportPayment(userId: string): Promise<boolean> {
  // Placeholder - implement actual payment checking logic
  // This would check if user has paid for individual report access
  
  try {
    // For demo purposes, return false for now
    // In real implementation:
    /*
    const payment = await prisma.reportPayment.findFirst({
      where: {
        userId,
        status: 'completed',
        expiresAt: {
          gte: new Date()
        }
      }
    });
    
    return !!payment;
    */
    
    return false; // No payment by default
  } catch (error) {
    console.error('Error checking report payment:', error);
    return false;
  }
}

// GET endpoint for checking access without requiring request body
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const feature = searchParams.get('feature') || 'pdf_download';

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        accountType: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const accessCheck = await checkFeatureAccess(user, feature);

    return NextResponse.json({
      success: true,
      hasAccess: accessCheck.hasAccess,
      reason: accessCheck.reason,
      isDemo: accessCheck.isDemo,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        accountType: user.accountType
      }
    });

  } catch (error) {
    console.error('Access check error:', error);
    return NextResponse.json({
      error: 'Access check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
