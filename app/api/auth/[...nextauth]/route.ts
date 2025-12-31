import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.name) {
          return null;
        }

        await dbConnect();

        let user = await UserModel.findOne({ email: credentials.email });

        if (!user) {
          user = await UserModel.create({
            email: credentials.email,
            name: credentials.name,
            role: 'learner',
          });
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github') {
        await dbConnect();

        let dbUser = await UserModel.findOne({ email: user.email || '' });

        if (!dbUser && user.email) {
          dbUser = await UserModel.create({
            email: user.email,
            name: user.name || 'GitHub User',
            githubUsername: (profile as Record<string, unknown>)?.login as string,
            role: 'learner',
          });
        } else if ((profile as Record<string, unknown>)?.login && dbUser && !dbUser.githubUsername) {
          dbUser.githubUsername = (profile as Record<string, unknown>)?.login as string;
          await dbUser.save();
        }

        if (dbUser) {
          user.id = dbUser._id.toString();
        }
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
