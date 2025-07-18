import { Container } from '@mui/material';
import Layout from '../../src/components/Layout';
import { getSession } from 'next-auth/react';
import AppointmentsPanel from '../../src/components/AppointmentsPanel';
import { GetServerSidePropsContext } from 'next';
import AppointmentsPanelTopBar from '../../src/components/AppointmentsPanel/AppointmentsPanelTopBar';

export default function BarberAppointments() {
  return (
    <Layout pageTitle='Gerir Agendamentos | Lacucaracha Barbershop' disableFooter disablePadding>
      <Container
        sx={{
          padding: '20px',
        }}
      >
        <AppointmentsPanelTopBar />
        <AppointmentsPanel />
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/entrar',
        permanent: false,
      },
    };
  }

  if (session && !session.user.extraInfo.isBarber) {
    return {
      redirect: {
        destination: '/agendar',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
