import NextAuth, { type NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/database';
import { getUserPassword, verifyPassword } from '@/lib/auth/password';

declare module 'next-auth' {
  interface User {
    role: string;
    student?: any;
    teacher?: any;
    parent?: any;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
      student?: any;
      teacher?: any;
      parent?: any;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    student?: any;
    teacher?: any;
    parent?: any;
  }
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'STUDENT', // Default role
        };
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            student: true,
            teacher: true,
            parent: true,
            school: true,
          },
        });

        if (!user || !user.isActive) {
          return null;
        }

        // Get password from account table
        const storedPassword = await getUserPassword(user.id);
        if (!storedPassword) {
          return null;
        }

        const isValidPassword = await verifyPassword(credentials.password as string, storedPassword);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          image: user.image,
          role: user.role,
          student: user.student,
          teacher: user.teacher,
          parent: user.parent,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.student = user.student;
        token.teacher = user.teacher;
        token.parent = user.parent;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub!;
        (session.user as any).role = token.role;
        (session.user as any).student = token.student;
        (session.user as any).teacher = token.teacher;
        (session.user as any).parent = token.parent;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image,
                role: 'STUDENT',
                isActive: true,
              },
            });
          }
        } catch (error) {
          console.error('Error handling Google sign in:', error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.email) {
        console.log(`User signed out: ${token.email}`);
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// For compatibility with existing code  
export const authOptions = authConfig;

// Export default for Next.js
export default NextAuth(authConfig);
