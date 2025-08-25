import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDodoPayClient } from '@/lib/dodopay';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';

export const dynamic = 'force-dynamic';

export async function POST(req) {
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

    const subscription = await Subscription.findOne({ userId: user._id });
    
    if (!subscription || !subscription.dodoPaySubscriptionId) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    const dodoPayClient = getDodoPayClient();
    
    // Cancel subscription with DodoPay
    await dodoPayClient.cancelSubscription(subscription.dodoPaySubscriptionId);
    
    // Update local subscription
    subscription.status = 'canceled';
    subscription.cancelAtPeriodEnd = true;
    await subscription.save();

    return NextResponse.json({
      message: 'Subscription canceled successfully',
      subscription: {
        id: subscription._id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
