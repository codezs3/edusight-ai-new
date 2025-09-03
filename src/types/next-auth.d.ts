import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      accountType: string;
      schoolId?: string;
      parentId?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string;
    accountType: string;
    schoolId?: string;
    parentId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    accountType: string;
    schoolId?: string;
    parentId?: string;
  }
}