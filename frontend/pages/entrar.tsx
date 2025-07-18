import Layout from '../src/components/Layout';
import { Button, Container, Stack, TextField, Box, Link as MUILink } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import Link from 'next/link';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Introduza um email válido')
    .max(100, 'Email inválido')
    .required('Este campo é obrigatório'),
  password: yup
    .string()
    .min(6, 'A password deve ter no mínimo 6 caracteres')
    .max(60, 'A password deve ter no máximo 60 caracteres')
    .required('Este campo é obrigatório'),
});

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (session) {
      router.push('/agendar');
    }
  }, [session]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const signInResponse: any = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInResponse?.error) {
        enqueueSnackbar(signInResponse.error, { variant: 'error' });
      }
    },
  });

  return (
    <Layout pageTitle='Entrar | Lacucaracha Barbershop' disablePadding disableFooter>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          height: '100%',
          maxWidth: '500px',
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box>
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
            <TextField
              id='password'
              name='password'
              label='Password'
              type='password'
              variant='filled'
              fullWidth
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Box mt={1} sx={{ textAlign: 'right' }}>
              <MUILink component={Link} href='/conta/repor-password' passHref>
                Esqueceu-se da password?
              </MUILink>
            </Box>
          </Box>
          <Stack mt={3} spacing={1}>
            <Button type='submit' variant='contained' fullWidth>
              Entrar
            </Button>
            <Link href='/registar' passHref>
              <Button variant='outlined' fullWidth>
                Registar
              </Button>
            </Link>
          </Stack>
        </form>
      </Container>
    </Layout>
  );
}
