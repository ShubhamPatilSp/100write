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
      try {
        await connectDB();
        let dbUser = await User.findOne({ email: user.email });

        if (account?.provider === 'google') {
          if (!dbUser) {
            const placeholderPassword = await bcrypt.hash(randomUUID(), 10);
            dbUser = await User.create({
              name: user.name || user.email,
              email: user.email,
              password: placeholderPassword,
              provider: 'google',
            });
          } else if (dbUser.provider !== 'google') {
            dbUser.provider = 'google';
            await dbUser.save();
          }
        }

        if (!dbUser) return false;

        user.id = dbUser._id.toString();
        user.provider = dbUser.provider; // Pass provider to JWT callback

      } catch (e) {
        console.error('Error during sign-in process:', e);
        return false;
      }

      // Create a session record for all successful sign-ins
      if (user && user.id) {
        try {
          const headersList = headers();
            const userAgent = headersList.get('user-agent') || 'Unknown Device';
          const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
          const newSessionToken = randomUUID();
          user.sessionToken = newSessionToken; // Pass session token to JWT callback

          let locationData = {
            location: 'Unknown Location',
            country: 'Unknown Country',
            countryCode: 'XX',
            city: 'Unknown City',
          };

          try {
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            if (response.ok) {
              const data = await response.json();
              locationData = {
                location: `${data.city}, ${data.region}`,
                country: data.country_name,
                countryCode: data.country_code,
                city: data.city,
              };
            }
          } catch (e) {
            console.error('Failed to fetch location from IP API', e);
          }

          await connectDB();
          await Session.create({
            userId: user.id,
            sessionToken: newSessionToken,
            device: userAgent,
            ...locationData,
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
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.provider = user.provider;
        token.sessionToken = user.sessionToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id;
        session.user.email = token.email || session.user.email;
        session.user.name = token.name || session.user.name;
        session.user.provider = token.provider;
        session.user.sessionToken = token.sessionToken;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
