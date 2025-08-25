import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

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

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const appAuthOptions = await getAuthOptions();
    const session = await getServerSession(appAuthOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { firstName, lastName } = await req.json();

    if (!firstName) {
      return NextResponse.json({ message: 'First name is required' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        firstName,
        lastName: lastName || '',
        name: `${firstName} ${lastName || ''}`.trim(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
