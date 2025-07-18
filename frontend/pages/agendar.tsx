import Layout, { PageCode } from '../src/components/Layout';
import {
  Avatar,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  Box,
  Backdrop,
  CircularProgress,
  Grow,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useActiveBarbers } from '../src/lib/api';
import ScheduleAppointmentDialog from '../src/components/ScheduleAppointment/Dialog';
import BarberProfileDialog from '../src/components/Profile/Dialog';
import { barberProfiles } from '../src/samples/barberProfiles';

export default function Agendar() {
  const { data: session, status } = useSession();
  const { barbers } = useActiveBarbers();
  const [open, setOpen] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar');
    }

    // @ts-ignore
    if (session && session.user.extraInfo == 'Antes de prosseguir deve verificar o seu email.') {
      router.push('/conta/verificar');
    }
  }, [status, session]);

  if (!session || !barbers) {
    return (
      <Layout pageTitle='Agendar | Lacucaracha Barbershop' activePageCode={PageCode.SCHEDULE} disablePadding>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Layout>
    );
  }

  function handleClose() {
    setOpen(false);
  }

  function handleProfileDialogClose() {
    setOpenProfileDialog(false);
  }

  return (
    <Layout
      pageTitle='Agendar | Lacucaracha Barbershop'
      activePageCode={PageCode.SCHEDULE}
      disablePadding
      disableFooter
    >
      <Box
        bgcolor='#FFFFFF'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          height: '100%',
          p: '40px 0px',
        }}
      >
        <Container>
          <Typography variant='h3' gutterBottom>
            Esta plataforma vai ser descontinuada nos próximos dias.
          </Typography>
          <Button variant='contained' href='https://noona.pt/lacucaracha'>
            Continuar para a nova plataforma
          </Button>
        </Container>
      </Box>
      <ScheduleAppointmentDialog open={open} onClose={handleClose} selectedBarber={selectedBarber} />
      <BarberProfileDialog
        open={openProfileDialog}
        onClose={handleProfileDialogClose}
        selectedBarber={selectedBarber}
      />
    </Layout>
  );
}
