import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getDodoPayClient } from '@/lib/dodopay';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dodoPay = getDodoPayClient();
    const history = await dodoPay.getCustomerBillingHistory(session.user.email);

    return NextResponse.json(history);

  } catch (error) {
    console.error('Get billing history error:', error);
    return NextResponse.json(
      { error: 'Failed to get billing history' },
      { status: 500 }
    );
  }
}
