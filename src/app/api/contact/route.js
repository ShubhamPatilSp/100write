import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, name, message } = await request.json();

    // In a real application, you would add your email sending logic here.
    // For example, using a service like Nodemailer or an API like SendGrid.
    console.log('Received contact form submission:');
    console.log({ email, name, message });

    // Simulate a successful response
    return NextResponse.json({ message: 'Message received successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
