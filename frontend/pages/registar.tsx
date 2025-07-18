import Layout from '../src/components/Layout';
import { Button, Container, Stack, TextField, Box, Typography, Checkbox } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import Link from 'next/link';
import { signUp } from '../src/lib/api';

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
  passwordConfirmation: yup
    .string()
    .min(6, 'A password deve ter no mínimo 6 caracteres')
    .max(60, 'A password deve ter no máximo 60 caracteres')
    .oneOf([yup.ref('password')], 'As passwords não coincidem')
    .required('Este campo é obrigatório'),
  firstName: yup
    .string()
    .min(2, 'O primeiro nome deve ter no mínimo 2 caracteres')
    .max(40, 'O primeiro nome deve ter no máximo 40 caracteres')
    .required('Este campo é obrigatório'),
  lastName: yup
    .string()
    .min(2, 'O último nome deve ter no mínimo 2 caracteres')
    .max(40, 'O último nome deve ter no máximo 40 caracteres')
    .required('Este campo é obrigatório'),
  phoneNumber: yup
    .number()
    .typeError('Número de telemóvel inválido')
    .positive('Número de telemóvel inválido')
    .min(900000000, 'Número de telemóvel inválido')
    .max(999999999, 'Número de telemóvel inválido')
    .required('Este campo é obrigatório'),
  acceptPrivacyPolicy: yup.boolean().isTrue('Este campo é obrigatório'),
});

export default function SignUp() {
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
      passwordConfirmation: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      acceptPrivacyPolicy: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await signUp(values.email, values.password, values.firstName, values.lastName, +values.phoneNumber);
        await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });
      } catch (error: any) {
        enqueueSnackbar(error.response.data.message, { variant: 'error' });
      }
    },
  });

  return (
    <Layout pageTitle='Registar | Lacucaracha Barbershop' disablePadding disableFooter>
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
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ mb: 1 }}
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
              sx={{ mb: 1 }}
            />
            <TextField
              id='passwordConfirmation'
              name='passwordConfirmation'
              label='Confirmar Password'
              type='password'
              variant='filled'
              fullWidth
              value={formik.values.passwordConfirmation}
              onChange={formik.handleChange}
              error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
              helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
              sx={{ mb: 1 }}
            />
            <TextField
              id='firstName'
              name='firstName'
              label='Primeiro Nome'
              type='firstName'
              variant='filled'
              fullWidth
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
              sx={{ mb: 1 }}
            />
            <TextField
              id='lastName'
              name='lastName'
              label='Último Nome'
              type='lastName'
              variant='filled'
              fullWidth
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              sx={{ mb: 1 }}
            />
            <TextField
              id='phoneNumber'
              name='phoneNumber'
              label='Número de Telemóvel'
              type='phoneNumber'
              variant='filled'
              fullWidth
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              sx={{ mb: 1 }}
            />
            <Typography
              color={Boolean(formik.errors.acceptPrivacyPolicy) && formik.errors.acceptPrivacyPolicy ? 'red' : ''}
            >
              <Checkbox
                id='acceptPrivacyPolicy'
                name='acceptPrivacyPolicy'
                value={formik.values.acceptPrivacyPolicy}
                onChange={formik.handleChange}
              />
              Li e concordo com a {}
              <a href='/politica-de-privacidade' target='_blank'>
                Política de Privacidade
              </a>
            </Typography>
          </Box>
          <Stack mt={3} spacing={1}>
            <Button type='submit' variant='contained' fullWidth>
              Registar
            </Button>
            <Link href='/entrar' passHref>
              <Button variant='outlined' fullWidth>
                Entrar
              </Button>
            </Link>
          </Stack>
        </form>
      </Container>
    </Layout>
  );
}
