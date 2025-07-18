import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../src/base/theme';
import createEmotionCache from '../src/base/createEmotionCache';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { SnackbarProvider } from 'notistack';
import CookieConsent from 'react-cookie-consent';
import { Button } from '@mui/material';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  session: Session;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, session } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Lacucaracha Barbershop</title>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <CssBaseline />
          <SessionProvider session={session}>
            <Component {...pageProps} />
            <CookieConsent
              buttonText='Continuar'
              cookieName='cookieNoticeClosed'
              style={{ background: 'black' }}
              buttonStyle={{ background: 'white' }}
              ButtonComponent={Button}
            >
              Utilizamos cookies essenciais relacionadas com a autenticação de utilizadores.
            </CookieConsent>
          </SessionProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
