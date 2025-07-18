import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
    accessTokenExpires: Date;
    user: {
      email: string;
      name: string;
      uid: string;
      extraInfo: {
        firstName: string;
        lastName: string;
        phoneNumber: number;
        isBarber: boolean;
        weeklySchedule: [{ from: number; to: number; breaks: number[]; available: boolean }];
      };
    };
  }
}
