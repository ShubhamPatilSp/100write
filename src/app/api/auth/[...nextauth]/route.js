import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import Session from '@/models/Session';
import { headers } from 'next/headers';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectDB();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          return { id: user._id.toString(), email: user.email, name: user.email };
        } catch (error) {
          console.log('Error: ', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
        async signIn({ user, account }) {
      if (account?.provider === 'google' && user?.email) {
        try {
          await connectDB();
          let dbUser = await User.findOne({ email: user.email });

          if (!dbUser) {
            const placeholderPassword = await bcrypt.hash(randomUUID(), 10);
            dbUser = await User.create({
              name: user.name || user.email,
              email: user.email,
              password: placeholderPassword, // Google users won't use this
            });
          }

          // IMPORTANT: Replace the provider's user ID with your database's user ID
          user.id = dbUser._id.toString();

        } catch (e) {
          console.error('Error during Google sign-in process:', e);
          return false; // Prevent sign-in if there's a DB error
        }
      }

      // Create a session record for all successful sign-ins
      if (user && user.id) {
        try {
          const headersList = headers();
          const userAgent = headersList.get('user-agent') || 'Unknown Device';
          await connectDB();
          await Session.create({
            userId: user.id, // Now this is the MongoDB _id
            sessionToken: randomUUID(),
            device: userAgent,
            location: 'Unknown Location',
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          });
        } catch (e) {
          console.error('Failed to create session record on sign-in', e);
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // On initial sign-in, the 'user' object from signIn is available
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
        async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id;
        try {
          await connectDB();
          const user = await User.findById(token.id).select('provider');
          if (user) {
            session.user.provider = user.provider;
          }
        } catch (e) {
          console.error('Failed to fetch user provider status', e);
        }
      }

      if (session?.user && token) {
        session.user.id = token.id;
        session.user.email = token.email || session.user.email;
        session.user.name = token.name || session.user.name;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
