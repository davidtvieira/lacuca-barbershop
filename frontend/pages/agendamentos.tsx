import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../src/components/Layout';
import {
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tab,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider, StaticDatePicker, TabContext, TabList, TabPanel } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ptLocale from 'date-fns/locale/pt';
import { addMonths, format, isPast, lightFormat, parseISO } from 'date-fns';
import {
  deleteAppointment,
  useClientScheduledAppointments,
  useClientScheduledAppointmentsActive,
} from '../src/lib/api';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { useSnackbar } from 'notistack';
import { barberProfiles } from '../src/samples/barberProfiles';

export default function Agendamentos() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [calendarValue, setCalendarValue] = useState(new Date());
  const { appointments, mutateAppointments } = useClientScheduledAppointments(lightFormat(calendarValue, 'yyyy-MM'));
  const { activeAppointments, mutateActiveAppointments } = useClientScheduledAppointmentsActive();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuItemIndex, setSelectedMenuItemIndex] = useState<number>(0);
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState('1');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar');
    }

    // @ts-ignore
    if (session && session.user.extraInfo == 'Antes de prosseguir deve verificar o seu email.') {
      router.push('/conta/verificar');
    }
  }, [status, session]);

  if (!session) {
    return (
      <Layout pageTitle='Agendamentos | Lacucaracha Barbershop' disableFooter>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Layout>
    );
  }

  const open = Boolean(anchorEl);
  const handleClick = (event: any, index: number) => {
    setSelectedMenuItemIndex(index);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // @ts-ignore
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <Layout pageTitle='Agendamentos | Lacucaracha Barbershop' disableFooter>
      <Container>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange}>
              <Tab label='Próximos' value='1' />
              <Tab label='Histórico' value='2' />
            </TabList>
          </Box>
          <TabPanel value='1' sx={{ padding: '20px 0px 0px 0px' }}>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight='light' fontSize='18px'>
                Agendamentos
              </Typography>
              {activeAppointments && activeAppointments.length > 0 ? (
                <List>
                  {activeAppointments.map((activeAppointment: any, index: number) => (
                    <ListItem key={`${index}_activeAppointment`} disableGutters>
                      <Paper elevation={3} sx={{ padding: 2, width: '100%' }}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Avatar
                            src={barberProfiles.find((b) => b.uid == activeAppointment.barberUID)?.profilePhoto}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography fontSize='13px'>
                              {`${activeAppointment.barber.firstName} ${activeAppointment.barber.lastName}`}
                            </Typography>
                            <Typography fontWeight='light' fontSize='10px' variant='overline'>
                              {format(parseISO(activeAppointment.date), 'PPPPp', { locale: ptLocale })}
                            </Typography>
                          </Box>
                          {!isPast(parseISO(activeAppointment.date)) && (
                            <>
                              <IconButton aria-label='delete' onClick={(event) => handleClick(event, index)}>
                                <DeleteIcon />
                              </IconButton>
                              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                <MenuItem
                                  onClick={async () => {
                                    try {
                                      await deleteAppointment(
                                        activeAppointments[selectedMenuItemIndex].barberUID,
                                        activeAppointments[selectedMenuItemIndex].date
                                      );
                                      mutateActiveAppointments();
                                      mutateAppointments();
                                      enqueueSnackbar('Agendamento cancelado com sucesso.', { variant: 'success' });
                                      handleClose();
                                    } catch (error) {
                                      enqueueSnackbar('Não foi possível cancelar o agendamento.', {
                                        variant: 'error',
                                      });
                                    }
                                  }}
                                >
                                  Eliminar agendamento
                                </MenuItem>
                              </Menu>
                            </>
                          )}
                        </Stack>
                      </Paper>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography fontWeight='bold' fontSize='17px' mt={2}>
                  Não existem agendamentos pendentes
                </Typography>
              )}
            </Box>
          </TabPanel>
          <TabPanel value='2' sx={{ padding: '20px 0px 0px 0px' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptLocale}>
                <StaticDatePicker
                  displayStaticWrapperAs='desktop'
                  openTo='month'
                  views={['year', 'month']}
                  label='Escolher mês e ano'
                  minDate={new Date('2022-02-01')}
                  maxDate={addMonths(new Date(), 3)}
                  value={calendarValue}
                  onChange={(newValue) => {
                    setCalendarValue(newValue as Date);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight='light' fontSize='18px'>
                  Agendamentos
                </Typography>
                {appointments && appointments.length > 0 ? (
                  <List>
                    {appointments.map((appointment: any, index: number) => (
                      <ListItem key={`${index}_appointment`} disableGutters>
                        <Paper elevation={3} sx={{ padding: 2, width: '100%' }}>
                          <Stack direction='row' spacing={1} alignItems='center'>
                            <Avatar src={barberProfiles.find((b) => b.uid == appointment.barberUID)?.profilePhoto} />
                            <Box sx={{ flex: 1 }}>
                              <Typography fontSize='13px'>
                                {`${appointment.barber.firstName} ${appointment.barber.lastName}`}
                              </Typography>
                              <Typography fontWeight='light' fontSize='10px' variant='overline'>
                                {format(parseISO(appointment.date), 'PPPPp', { locale: ptLocale })}
                              </Typography>
                            </Box>
                            {!isPast(parseISO(appointment.date)) && (
                              <>
                                <IconButton aria-label='delete' onClick={(event) => handleClick(event, index)}>
                                  <DeleteIcon />
                                </IconButton>
                                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                  <MenuItem
                                    onClick={async () => {
                                      try {
                                        await deleteAppointment(
                                          appointments[selectedMenuItemIndex].barberUID,
                                          appointments[selectedMenuItemIndex].date
                                        );
                                        mutateAppointments();
                                        mutateActiveAppointments();
                                        enqueueSnackbar('Agendamento cancelado com sucesso.', { variant: 'success' });
                                        handleClose();
                                      } catch (error) {
                                        enqueueSnackbar('Não foi possível cancelar o agendamento.', {
                                          variant: 'error',
                                        });
                                      }
                                    }}
                                  >
                                    Eliminar agendamento
                                  </MenuItem>
                                </Menu>
                              </>
                            )}
                          </Stack>
                        </Paper>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography fontWeight='bold' fontSize='17px' mt={2}>
                    Não existem agendamentos associados à data selecionada
                  </Typography>
                )}
              </Box>
            </Stack>
          </TabPanel>
        </TabContext>
      </Container>
    </Layout>
  );
}
