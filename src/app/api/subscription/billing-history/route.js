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

    // MOCK DATA: Return a sample billing history to avoid crashing the app
    const mockHistory = {
      invoices: [
        {
          id: 'inv_1',
          invoice_number: 'INV-2023-001',
          amount: 2499, // in cents
          currency: 'usd',
          created_at: new Date().toISOString(),
          status: 'paid',
        },
        {
          id: 'inv_2',
          invoice_number: 'INV-2023-002',
          amount: 2499,
          currency: 'usd',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          status: 'paid',
        },
        {
          id: 'inv_3',
          invoice_number: 'INV-2023-003',
          amount: 1000,
          currency: 'usd',
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
          status: 'paid',
        },
      ],
      has_more: false,
    };

    return NextResponse.json(mockHistory);

  } catch (error) {
    console.error('Get billing history error:', error);
    return NextResponse.json(
      { error: 'Failed to get billing history' },
      { status: 500 }
    );
  }
}
