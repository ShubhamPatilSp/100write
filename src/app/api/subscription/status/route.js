import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PRICING_PLANS } from '@/lib/dodopay';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let subscription = await Subscription.findOne({ userId: user._id });
    
    // Create default free subscription if none exists
    if (!subscription) {
      subscription = new Subscription({
        userId: user._id,
        planId: 'free',
        status: 'active',
        usage: {
          words: 0,
          detections: 0,
          humanizations: 0,
          lastResetDate: new Date(),
        },
      });
      await subscription.save();
    }

    // Reset monthly usage if needed
    await subscription.resetMonthlyUsage();

    const plan = Object.values(PRICING_PLANS).find(p => p.id === subscription.planId) || PRICING_PLANS.FREE;

    return NextResponse.json({
      subscription: {
        id: subscription._id,
        planId: subscription.planId,
        planName: plan.name,
        status: subscription.status,
        isActive: subscription.isActive(),
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        usage: subscription.usage,
        limits: plan.limits,
      },
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        interval: plan.interval,
        features: plan.features,
        limits: plan.limits,
      },
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}
