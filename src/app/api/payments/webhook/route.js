import { NextResponse } from 'next/server';
import { getDodoPayClient } from '@/lib/dodopay';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get('dodo-signature');
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const dodoPayClient = getDodoPayClient();
    
    // Verify webhook signature
    if (!dodoPayClient.verifyWebhook(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    
    await connectDB();

    switch (event.type) {
      case 'subscription.created':
        await handleSubscriptionCreated(event.data);
        break;
        
      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data);
        break;
        
      case 'subscription.canceled':
        await handleSubscriptionCanceled(event.data);
        break;
        
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.data);
        break;
        
      case 'payment.failed':
        await handlePaymentFailed(event.data);
        break;
        
      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleSubscriptionCreated(subscriptionData) {
  const { customer, metadata, id: dodoPaySubscriptionId } = subscriptionData;
  
  if (!metadata?.userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  const user = await User.findById(metadata.userId);
  if (!user) {
    console.error('User not found:', metadata.userId);
    return;
  }

  // Create or update subscription
  await Subscription.findOneAndUpdate(
    { userId: user._id },
    {
      dodoPaySubscriptionId,
      dodoPayCustomerId: customer.id,
      planId: metadata.planId || 'pro_monthly',
      status: 'active',
      currentPeriodStart: new Date(subscriptionData.current_period_start * 1000),
      currentPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
      cancelAtPeriodEnd: false,
      usage: {
        words: 0,
        detections: 0,
        humanizations: 0,
        lastResetDate: new Date(),
      },
    },
    { upsert: true, new: true }
  );

  console.log(`Subscription created for user ${user.email}`);
}

async function handleSubscriptionUpdated(subscriptionData) {
  const subscription = await Subscription.findOne({
    dodoPaySubscriptionId: subscriptionData.id
  });

  if (!subscription) {
    console.error('Subscription not found:', subscriptionData.id);
    return;
  }

  subscription.status = subscriptionData.status;
  subscription.currentPeriodStart = new Date(subscriptionData.current_period_start * 1000);
  subscription.currentPeriodEnd = new Date(subscriptionData.current_period_end * 1000);
  subscription.cancelAtPeriodEnd = subscriptionData.cancel_at_period_end || false;

  await subscription.save();
  console.log(`Subscription updated: ${subscriptionData.id}`);
}

async function handleSubscriptionCanceled(subscriptionData) {
  const subscription = await Subscription.findOne({
    dodoPaySubscriptionId: subscriptionData.id
  });

  if (!subscription) {
    console.error('Subscription not found:', subscriptionData.id);
    return;
  }

  subscription.status = 'canceled';
  subscription.cancelAtPeriodEnd = true;

  await subscription.save();
  console.log(`Subscription canceled: ${subscriptionData.id}`);
}

async function handlePaymentSucceeded(paymentData) {
  if (paymentData.subscription_id) {
    const subscription = await Subscription.findOne({
      dodoPaySubscriptionId: paymentData.subscription_id
    });

    if (subscription) {
      subscription.status = 'active';
      await subscription.save();
      console.log(`Payment succeeded for subscription: ${paymentData.subscription_id}`);
    }
  }
}

async function handlePaymentFailed(paymentData) {
  if (paymentData.subscription_id) {
    const subscription = await Subscription.findOne({
      dodoPaySubscriptionId: paymentData.subscription_id
    });

    if (subscription) {
      subscription.status = 'past_due';
      await subscription.save();
      console.log(`Payment failed for subscription: ${paymentData.subscription_id}`);
    }
  }
}
