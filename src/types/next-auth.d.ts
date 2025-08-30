import NextAuth from 'next-auth';

declare module 'next-auth' {
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

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
    student?: any;
    teacher?: any;
    parent?: any;
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
