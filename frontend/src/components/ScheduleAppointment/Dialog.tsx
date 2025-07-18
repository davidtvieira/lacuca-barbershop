import { DatePicker, LoadingButton, LocalizationProvider, PickersDay } from '@mui/lab';
import {
  Dialog,
  Typography,
  Box,
  Grid,
  Paper,
  Stack,
  TextField,
  Avatar,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {
  addMonths,
  formatISO,
  getDay,
  getHours,
  isSameDay,
  isWithinInterval,
  lightFormat,
  parseISO,
  set,
} from 'date-fns';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ptLocale from 'date-fns/locale/pt';
import { useEffect, useState } from 'react';
import { scheduleAppointment, useBarberUnavailability, useScheduledAppointments, useUserProfile } from '../../lib/api';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { barberProfiles } from '../../samples/barberProfiles';

export default function ScheduleAppointmentDialog(props: any) {
  const { onClose, selectedBarber, open } = props;
  const { data: session } = useSession();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const [calendarValue, setCalendarValue] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(formatISO(new Date()));
  const [availableHours, setAvailableHours] = useState<number[]>([]);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');

  const { appointments, isValidating: isValidatingAppointments } = useScheduledAppointments(
    selectedBarber?.uid,
    lightFormat(parseISO(calendarMonth), 'yyyy-MM')
  );
  const {
    unavailabilities,
    isValidating: isValidatingUnavailabilities,
    isError: isErrorLoadingUserUnavailabilities,
  } = useBarberUnavailability(selectedBarber?.uid);
  const {
    userProfile,
    isLoading: isLoadingUserProfile,
    isError: isErrorLoadingUserProfile,
  } = useUserProfile(selectedBarber?.uid);

  useEffect(() => {
    let hours = [];
    if (userProfile && calendarValue) {
      // @ts-ignore
      const daySchedule = userProfile.weeklySchedule[getDay(calendarValue)];

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
    if (appointments && unavailabilities && userProfile?.weeklySchedule) {
      const dayIsUnavailable = unavailabilities.find((unavailability: any) =>
        isWithinInterval(date, { start: parseISO(unavailability.from), end: parseISO(unavailability.to) })
      );

      const scheduledAppointmentsCount = appointments.filter((appointment: any) =>
        isSameDay(parseISO(appointment.date), date)
      ).length;

      if (dayIsUnavailable) {
        return <PickersDay key={date.toString()} {...pickersDayProps} disabled />;
      }

      if (
        scheduledAppointmentsCount > 0 &&
        scheduledAppointmentsCount >
          userProfile.weeklySchedule[getDay(date)].to -
            userProfile.weeklySchedule[getDay(date)].from -
            userProfile.weeklySchedule[getDay(date)].breaks.length
      ) {
        return <PickersDay key={date.toString()} {...pickersDayProps} disabled />;
      }
    }

    return <PickersDay key={date.toString()} {...pickersDayProps} />;
  }

  if (!selectedBarber) {
    return (
      <Dialog onClose={onClose} open={open}>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Dialog>
    );
  }

  function handleDialogClose() {
    setCalendarValue(null);
    setCalendarMonth(formatISO(new Date()));
    setAvailableHours([]);
    setSelectedHour(null);
    setDescription('');
    onClose();
  }

  return (
    <Dialog onClose={handleDialogClose} open={open}>
      <Paper sx={{ padding: 3, maxWidth: '544px' }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={5} mb={5}>
          <Avatar
            sx={{ width: '100px', height: '100px' }}
            src={barberProfiles.find((b) => b.uid == selectedBarber.uid)?.profilePhoto}
          />
          <Typography fontWeight='light' fontSize='18px' sx={{ textTransform: 'uppercase' }}>
            {selectedBarber.firstName} {selectedBarber.lastName}
          </Typography>
        </Stack>
        <Stack spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptLocale}>
            <DatePicker
              label='Selecionar data'
              disablePast
              minDate={new Date()}
              maxDate={addMonths(new Date(), 3)}
              value={calendarValue}
              shouldDisableDate={(date) =>
                // @ts-ignore
                userProfile ? !userProfile.weeklySchedule[getDay(date)].available : false
              }
              renderDay={renderDay}
              onMonthChange={(newValue) => {
                if (newValue) {
                  setCalendarMonth(formatISO(newValue));
                }
              }}
              onChange={(newValue) => {
                if (newValue) {
                  setCalendarValue(newValue as Date);
                  setCalendarMonth(formatISO(newValue as Date));
                }
              }}
              showToolbar={false}
              loading={
                isValidatingAppointments ||
                isValidatingUnavailabilities ||
                isLoadingUserProfile ||
                isErrorLoadingUserProfile ||
                isErrorLoadingUserUnavailabilities
              }
              renderLoading={() => {
                return <CircularProgress color='inherit' />;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-input.Mui-disabled': {
                      color: 'black',
                      WebkitTextFillColor: 'black',
                    },
                  }}
                  InputLabelProps={{ disabled: false }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                />
              )}
              ignoreInvalidInputs={true}
              disableCloseOnSelect={false}
              cancelText='Cancelar'
              okText='Continuar'
            />
          </LocalizationProvider>
          {session?.user.extraInfo.isBarber && (
            <TextField
              id='description'
              label='Descrição (opcional)'
              variant='outlined'
              helperText='Máximo 150 caracteres'
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              error={description.length > 150}
            />
          )}
          <Box>
            <Typography fontWeight='light' fontSize='17px'>
              Vagas
            </Typography>
            {availableHours.length > 0 ? (
              <Grid container spacing={1}>
                {availableHours.map((hours, index) => (
                  <Grid item key={`${index}2_appointment`}>
                    <LoadingButton
                      variant='outlined'
                      sx={{ maxWidth: '64px' }}
                      onClick={async () => {
                        try {
                          setSelectedHour(hours);
                          await scheduleAppointment(
                            selectedBarber.uid,
                            // @ts-ignore
                            formatISO(set(calendarValue, { hours: hours, minutes: 0, seconds: 0, milliseconds: 0 })),
                            description.length > 0 && description.length <= 150 ? description : undefined
                          );
                          enqueueSnackbar(`Agendamento com ${selectedBarber.firstName} efetuado com sucesso.`, {
                            variant: 'success',
                          });
                          router.push('/agendamentos');
                        } catch (error: any) {
                          setSelectedHour(null);
                          const errorMessage = error.response?.data?.message;
                          enqueueSnackbar(
                            `Não foi possível efetuar o agendamento. ${errorMessage && `Motivo: ${errorMessage}`}`,
                            { variant: 'error' }
                          );
                        }
                      }}
                      loading={selectedHour == hours}
                    >
                      {hours}:00
                    </LoadingButton>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography fontWeight='bold' fontSize='17px' mt={2}>
                Não existem vagas para esta data
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>
    </Dialog>
  );
}
