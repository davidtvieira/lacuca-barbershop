import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

async function refreshAccessToken(token) {
  try {
    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: token.refreshToken,
        }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.id_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    return {
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials, req) {
        const res = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
          {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              returnSecureToken: true,
            }),
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const user = await res.json();

        if (res.ok && user) {
          return user;
        }

        switch (user?.error?.message) {
          case 'EMAIL_NOT_FOUND':
            throw new Error('O email introduzido não está associado a nenhuma conta.');
          case 'INVALID_PASSWORD':
            throw new Error('Verifique a password e tente novamente.');
          case 'USER_DISABLED':
            throw new Error('A sua conta encontra-se desativada.');
          default:
            break;
        }

        if (user?.error?.message) {
          if (user.error.message.startsWith('TOO_MANY_ATTEMPTS_TRY_LATER')) {
            throw new Error(
              'O acesso a esta conta foi temporariamente bloqueado devido a várias tentativas de login falhadas. Por favor, tente novamente mais tarde.'
            );
          }
        }

        throw new Error(
          'Ocorreu um erro desconhecido. Por favor tente novamente mais tarde e se este erro continuar entre em contacto connosco.'
        );
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          name: user.displayName,
          email: user.email,
          accessToken: user.idToken,
          accessTokenExpires: Date.now() + user.expiresIn * 1000,
          refreshToken: user.refreshToken,
          uid: user.localId,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      const res = await fetch(`${process.env.SERVER_API_BASE_URL}/users/profile/${token.uid}`, {
        headers: { Authorization: token.accessToken },
      });
      const jsonResponse = await res.json();

      session.user = {
        name: token.name,
        email: token.email,
        uid: token.uid,
        extraInfo: jsonResponse.message,
      };
      session.accessToken = token.accessToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;
      session.expires = token.accessTokenExpires;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
