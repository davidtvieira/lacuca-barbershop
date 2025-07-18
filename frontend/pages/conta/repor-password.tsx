import { Alert, AlertColor, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../src/components/Layout';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Password } from '@mui/icons-material';
import { resetPassword, sendPasswordResetEmail } from '../../src/lib/api';

export default function PasswordResetPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor | undefined>(undefined);

  useEffect(() => {
    if (session) {
      router.push('/agendar');
    }
  }, [session]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email('Introduza um email válido')
        .max(100, 'Email inválido')
        .when({ is: () => !!!router.query.code, then: yup.string().required('Este campo é obrigatório') }),
      password: yup
        .string()
        .min(6, 'A password deve ter no mínimo 6 caracteres')
        .max(60, 'A password deve ter no máximo 60 caracteres')
        .when({ is: () => !!router.query.code, then: yup.string().required('Este campo é obrigatório') }),
      passwordConfirmation: yup
        .string()
        .min(6, 'A password deve ter no mínimo 6 caracteres')
        .max(60, 'A password deve ter no máximo 60 caracteres')
        .oneOf([yup.ref('password')], 'As passwords não coincidem')
        .when({ is: () => !!router.query.code, then: yup.string().required('Este campo é obrigatório') }),
    }),
    onSubmit: async (values) => {
      if (!router.query.code) {
        try {
          await sendPasswordResetEmail(values.email);
          setAlertMessage(
            'O email de reposição de password foi enviado. Verifique o seu email e siga as instruções para repor a sua password.'
          );
          setAlertSeverity('success');
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message;

          if (errorMessage == 'RESET_PASSWORD_EXCEED_LIMIT') {
            setAlertMessage('Aguarde um pouco antes de tentar repor a sua password novamente.');
            setAlertSeverity('error');
          } else if (errorMessage == 'EMAIL_NOT_FOUND') {
            setAlertMessage('Não existe uma conta associada ao email indicado.');
            setAlertSeverity('error');
          } else {
            setAlertMessage(
              `Não foi possível reenviar o email de reposição de password. Se este erro persistir entre em contacto connosco e indique o código #${
                errorMessage ? errorMessage : error.message ? error.message?.trim() : 'RPV1'
              }.`
            );
            setAlertSeverity('error');
          }
        }
      } else {
        try {
          await resetPassword(router.query.code as string, values.password);
          setAlertMessage(
            'A sua password foi alterada com sucesso. Pode iniciar sessão utilizando a sua nova password.'
          );
          setAlertSeverity('success');
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message;

          if (errorMessage == 'RESET_PASSWORD_EXCEED_LIMIT') {
            setAlertMessage('Aguarde um pouco antes de tentar repor a sua password novamente.');
            setAlertSeverity('error');
          } else if (errorMessage == 'INVALID_OOB_CODE') {
            setAlertMessage('O código de reposição utilizado expirou ou é inválido.');
            setAlertSeverity('error');
          } else {
            setAlertMessage(
              `Não foi possível alterar a sua password. Se este erro persistir entre em contacto connosco e indique o código #${
                errorMessage ? errorMessage : error.message ? error.message?.trim() : 'RPSV1'
              }.`
            );
            setAlertSeverity('error');
          }
        }
      }
    },
  });

  return (
    <Layout pageTitle='Repor password' disableFooter disablePadding>
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', pb: '16px' }}>
        <Paper sx={{ p: 5, width: '464px' }}>
          <form onSubmit={formik.handleSubmit}>
            {!router.query.code ? (
              <>
                <Stack alignItems='center' spacing={2} mb={2} sx={{ textAlign: 'center' }}>
                  <Password sx={{ fontSize: '70px' }} />
                  <Typography fontSize='25px' fontWeight='regular'>
                    Repor password
                  </Typography>
                  <Typography fontSize='17px' fontWeight='light'>
                    Indique o email que utilizou ao criar a sua conta.
                  </Typography>
                </Stack>
                <TextField
                  id='email'
                  name='email'
                  label='Email'
                  variant='filled'
                  fullWidth
                  sx={{ mb: 1 }}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                {alertMessage && (
                  <Alert severity={alertSeverity} sx={{ mb: 1 }}>
                    {alertMessage}
                  </Alert>
                )}
              </>
            ) : (
              <>
                <Stack alignItems='center' spacing={2} mb={2} sx={{ textAlign: 'center' }}>
                  <Password sx={{ fontSize: '70px' }} />
                  <Typography fontSize='25px' fontWeight='regular'>
                    Repor password
                  </Typography>
                  <Typography fontSize='17px' fontWeight='light'>
                    Indique a sua nova password.
                  </Typography>
                </Stack>
                <TextField
                  id='password'
                  name='password'
                  label='Nova Password'
                  type='password'
                  variant='filled'
                  fullWidth
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  sx={{ mb: 1 }}
                />
                <TextField
                  id='passwordConfirmation'
                  name='passwordConfirmation'
                  label='Confirmar Nova Password'
                  type='password'
                  variant='filled'
                  fullWidth
                  value={formik.values.passwordConfirmation}
                  onChange={formik.handleChange}
                  error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
                  helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                  sx={{ mb: 1 }}
                />
                {alertMessage && (
                  <Alert severity={alertSeverity} sx={{ mb: 1 }}>
                    {alertMessage}
                  </Alert>
                )}
              </>
            )}
            <Button type='submit' variant='contained' fullWidth>
              Repor password
            </Button>
          </form>
        </Paper>
      </Container>
    </Layout>
  );
}
