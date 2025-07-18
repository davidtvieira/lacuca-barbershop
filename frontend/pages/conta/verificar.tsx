import Layout from '../../src/components/Layout';
import {
  Stack,
  Typography,
  Backdrop,
  CircularProgress,
  Container,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Box,
  Alert,
  AlertColor,
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { differenceInSeconds } from 'date-fns';
import { checkEmailVerificationCode, verifyEmail } from '../../src/lib/api';
import { ExpandMore, MarkEmailUnread } from '@mui/icons-material';

export default function VerifyAccountEmail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor | undefined>(undefined);

  useEffect(() => {
    if (router.query.oobCode && router.query.mode) {
      if (router.query.mode === 'resetPassword') {
        router.push(`/conta/repor-password?code=${router.query.oobCode}`);
      } else if (router.query.mode === 'verifyEmail') {
        (async function () {
          try {
            await checkEmailVerificationCode(router.query.oobCode as string);
            if (session) {
              await signOut({ redirect: false });
            }
          } catch (error) {}
          router.push('/entrar');
        })();
      }
    } else {
      // @ts-ignore
      if (session && session.user.extraInfo != 'Antes de prosseguir deve verificar o seu email.') {
        router.push('/agendar');
      }

      if (
        status == 'authenticated' &&
        session &&
        // @ts-ignore
        session.user.extraInfo == 'Antes de prosseguir deve verificar o seu email.'
      ) {
        if (!router.query.oobCode) {
          if (differenceInSeconds(new Date(session.expires), new Date()) >= 3585) {
            (async function () {
              try {
                await verifyEmail(session?.accessToken);
              } catch (error) {}
            })();
          }
        }
      }
    }
  }, [status, session]);

  if (!session) {
    return (
      <Layout pageTitle='Verificar email | Lacucaracha Barbershop' disablePadding>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Layout>
    );
  }

  return (
    <Layout pageTitle='Verificar email | Lacucaracha Barbershop' disableFooter>
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 0 }}>
        <Paper sx={{ p: 5, maxWidth: '700px' }}>
          <Stack alignItems='center' spacing={2} mb={2} sx={{ textAlign: 'center' }}>
            <MarkEmailUnread sx={{ fontSize: '70px' }} />
            <Typography fontSize='25px' fontWeight='regular'>
              Verifique o seu email
            </Typography>
            <Typography fontSize='17px' fontWeight='light'>
              Para concluir o seu registo verifique o email que enviamos para <strong>{session.user.email}</strong> com
              as instruções necessárias.
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <Divider>Precisa de ajuda?</Divider>
            <Box>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>Não recebi nenhum email</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Box>
                      <Typography fontWeight='light'>Antes de prosseguir verifique se:</Typography>
                      <Typography fontWeight='light'>- o email não se encontra na pasta de spam</Typography>
                      <Typography fontWeight='light'>
                        - o email não aparece ao realizar uma pesquisa por @lacucarachabarbershop
                      </Typography>
                    </Box>
                    {alertMessage && <Alert severity={alertSeverity}>{alertMessage}</Alert>}
                    <Button
                      fullWidth
                      size='small'
                      variant='outlined'
                      onClick={async () => {
                        try {
                          await verifyEmail(session?.accessToken);
                          setAlertMessage('O email de verificação foi reenviado com sucesso.');
                          setAlertSeverity('success');
                        } catch (error: any) {
                          const errorMessage = error.response?.data?.error?.message;

                          if (errorMessage == 'TOO_MANY_ATTEMPTS_TRY_LATER') {
                            setAlertMessage(
                              'Aguarde um pouco antes de tentar reenviar o email de verificação novamente.'
                            );
                            setAlertSeverity('error');
                          } else {
                            setAlertMessage(
                              `Não foi possível reenviar o email de verificação. Se este erro persistir siga as instruções no fundo desta página e indique o código #${
                                errorMessage ? errorMessage : error.message ? error.message?.trim() : 'REV1'
                              }.`
                            );
                            setAlertSeverity('error');
                          }
                        }
                      }}
                    >
                      Reenviar email de verificação
                    </Button>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls='panel1a-content' id='panel1a-header'>
                  <Typography>Recebi o email</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Button fullWidth size='small' variant='outlined' onClick={() => signOut({ redirect: false })}>
                    Clique aqui se já verificou o seu email e continua a ver esta página
                  </Button>
                </AccordionDetails>
              </Accordion>
              <Typography fontWeight='light' mt={3}>
                Se continua a ter problemas a verificar o seu email depois de tentar seguir todas as instruções
                disponíveis, envie uma mensagem para o nosso{' '}
                <a target='_blank' href={`https://instagram.com/la_cucarachabarber`} rel='noopener noreferrer'>
                  instagram
                </a>{' '}
                ou ligue para o número <a href={`tel:919054320`}>919 054 320</a>.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Layout>
  );
}
