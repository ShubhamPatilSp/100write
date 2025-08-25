import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const documents = await Document.find({ userId: user._id }).sort({ createdAt: -1 });
    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred while fetching documents.', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    try {
        const { title, content } = await req.json();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const newDocument = new Document({
            title,
            content,
            userId: user._id,
        });

        await newDocument.save();

        return NextResponse.json(newDocument, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: 'An error occurred while creating the document.', error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    try {
        const { id } = await req.json();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const document = await Document.findOne({ _id: id, userId: user._id });

        if (!document) {
            return NextResponse.json({ message: 'Document not found or user not authorized to delete' }, { status: 404 });
        }

        await Document.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'An error occurred while deleting the document.', error: error.message },
            { status: 500 }
        );
    }
}
