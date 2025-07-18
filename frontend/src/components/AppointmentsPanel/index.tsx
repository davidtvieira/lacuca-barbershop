import {
  Avatar,
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
  Badge,
  Alert,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  addMonths,
  format,
  formatISO,
  getDay,
  getHours,
  isPast,
  isSameDay,
  isWithinInterval,
  lightFormat,
  parseISO,
} from 'date-fns';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ptLocale from 'date-fns/locale/pt';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { useEffect, useState } from 'react';
import { forceDeleteAppointment, useBarberUnavailability, useScheduledAppointments } from '../../lib/api';
import { useSession } from 'next-auth/react';
import PickersDay from '@mui/lab/PickersDay';
import Link from 'next/link';
import { useSnackbar } from 'notistack';

export default function AppointmentsPanel() {
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(formatISO(new Date()));
  const [availableHours, setAvailableHours] = useState<number[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuItemIndex, setSelectedMenuItemIndex] = useState<number>(0);
  const { appointments, mutateAppointments } = useScheduledAppointments(
    session?.user.uid,
    lightFormat(parseISO(calendarMonth), 'yyyy-MM')
  );
  const { unavailabilities } = useBarberUnavailability(session?.user.uid);

  useEffect(() => {
    let hours = [];
    if (session) {
      // @ts-ignore
      const daySchedule = session.user.extraInfo.weeklySchedule[getDay(calendarValue)];

      if (daySchedule) {
        for (let currHours = daySchedule.from; currHours <= daySchedule.to; currHours++) {
          if (!daySchedule.breaks.includes(currHours)) {
            const foundAppointment = appointments?.find(
              (appointment: any) =>
                isSameDay(parseISO(appointment.date), calendarValue) &&
                getHours(parseISO(appointment.date)) == currHours
            );
            if (!foundAppointment) {
              if (!(isSameDay(calendarValue, new Date()) && currHours <= getHours(new Date()))) {
                hours.push(currHours);
              }
            }
          }
        }
      }
    }

    setAvailableHours(hours);
  }, [calendarValue, appointments]);

  // @ts-ignore
  function renderDay(date: any, selectedDates: any, pickersDayProps: any) {
    if (!calendarValue) {
      return <PickersDay key={date.toString()} {...pickersDayProps} />;
    }

    if (appointments && unavailabilities) {
      const dayIsUnavailable = unavailabilities.find((unavailability: any) =>
        isWithinInterval(date, { start: parseISO(unavailability.from), end: parseISO(unavailability.to) })
      );

      const scheduledAppointmentsCount = appointments.filter((appointment: any) =>
        isSameDay(parseISO(appointment.date), date)
      ).length;

      if (dayIsUnavailable) {
        return <PickersDay key={date.toString()} {...pickersDayProps} disabled />;
      }

      if (scheduledAppointmentsCount > 0) {
        return (
          <Badge key={date.toString()} badgeContent={scheduledAppointmentsCount} color='primary' overlap='circular'>
            <PickersDay {...pickersDayProps} />
          </Badge>
        );
      }
    }

    return <PickersDay key={date.toString()} {...pickersDayProps} />;
  }

  const open = Boolean(anchorEl);
  const handleClick = (event: any, index: number) => {
    setSelectedMenuItemIndex(index);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper elevation={4} sx={{ padding: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent='space-between'>
        <Box sx={{ maxWidth: '320px', minHeight: '541px' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptLocale}>
            <StaticDatePicker
              minDate={new Date('2022-02-01')}
              maxDate={addMonths(new Date(), 3)}
              displayStaticWrapperAs='desktop'
              value={calendarValue}
              shouldDisableDate={(date) =>
                // @ts-ignore
                session ? !session.user.extraInfo.weeklySchedule[getDay(date)].available : false
              }
              renderDay={renderDay}
              onMonthChange={(newValue) => {
                setCalendarMonth(formatISO(newValue));
              }}
              onChange={(newValue) => {
                setCalendarValue(newValue as Date);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Box p='0px 0px 24px 24px'>
            <Typography fontWeight='light' fontSize='17px' mb={1}>
              Vagas
            </Typography>
            {availableHours.length > 0 ? (
              <Grid container spacing={1}>
                {availableHours.map((hours, index) => (
                  <Grid item key={`${index}2_appointment`}>
                    <Link href='/agendar' passHref>
                      <Button variant='outlined' sx={{ maxWidth: '64px' }}>
                        {hours}:00
                      </Button>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography fontWeight='bold' fontSize='17px' mt={2}>
                Não existem vagas para esta data
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight='light' fontSize='18px'>
            Agendamentos
          </Typography>
          {appointments && appointments.find((app: any) => isSameDay(parseISO(app.date), calendarValue)) ? (
            <List>
              {appointments
                .filter((app: any) => isSameDay(parseISO(app.date), calendarValue))
                .map((appointment: any, index: number) => (
                  <ListItem key={`${index}_appointment`} disableGutters>
                    <Paper elevation={3} sx={{ padding: 2, width: '100%' }}>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <Avatar />
                        <Box sx={{ flex: 1 }}>
                          <Typography fontSize='13px'>
                            {`${appointment.client.firstName} ${appointment.client.lastName}`}
                          </Typography>
                          {(appointment.description || appointment.client.phoneNumber) && (
                            <Alert severity='info'>
                              {appointment.client.phoneNumber && appointment.uid != session?.user.uid ? (
                                <Typography fontWeight='light' fontSize='13px'>
                                  Contacto: {appointment.client.phoneNumber}
                                </Typography>
                              ) : (
                                <Typography fontSize='13px'>Agendamento efetuado pelo próprio barbeiro</Typography>
                              )}
                              {appointment.description && (
                                <Typography fontWeight='light' fontSize='13px'>
                                  Descrição: {appointment.description}
                                </Typography>
                              )}
                            </Alert>
                          )}
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
                                  const filteredAppointments = appointments.filter((app: any) =>
                                    isSameDay(parseISO(app.date), calendarValue)
                                  );
                                  try {
                                    await forceDeleteAppointment(
                                      filteredAppointments[selectedMenuItemIndex].uid,
                                      filteredAppointments[selectedMenuItemIndex].date
                                    );
                                    mutateAppointments();
                                    enqueueSnackbar('Agendamento eliminado com sucesso.', { variant: 'success' });
                                    handleClose();
                                  } catch (error) {
                                    enqueueSnackbar('Não foi possível eliminar o agendamento.', { variant: 'error' });
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
              Não existem agendamentos para esta data
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
