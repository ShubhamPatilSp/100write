import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import Session from '@/models/Session';

// A helper function to get the main NextAuth config
async function getAuthOptions() {
  const { authOptions: appAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
  return appAuthOptions;
}

export async function GET(req) {
  try {
    const appAuthOptions = await getAuthOptions();
    const session = await getServerSession(appAuthOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const sessions = await Session.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const appAuthOptions = await getAuthOptions();
    const session = await getServerSession(appAuthOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ message: 'Session ID is required' }, { status: 400 });
    }

    await dbConnect();

    const result = await Session.findOneAndDelete({ _id: sessionId, userId: session.user.id });

    if (!result) {
      return NextResponse.json({ message: 'Session not found or you do not have permission to delete it' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Session deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
