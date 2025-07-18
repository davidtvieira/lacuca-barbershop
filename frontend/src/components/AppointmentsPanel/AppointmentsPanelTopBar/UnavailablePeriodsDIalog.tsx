import { Delete } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { format, formatISO, isPast, isWithinInterval, parseISO, set } from 'date-fns';
import ptLocale from 'date-fns/locale/pt';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { addUnavailabilityPeriod, deleteUnavailabilityPeriod, useBarberUnavailability } from '../../../lib/api';

export default function UnavailablePeriodsDialog({ open, handleClose }: { open: boolean; handleClose: any }) {
  const { data: session } = useSession();
  const { unavailabilities, mutateUnavailabilities } = useBarberUnavailability(session?.user.uid);
  const [calendarValueFrom, setCalendarValueFrom] = useState(new Date());
  const [calendarValueTo, setCalendarValueTo] = useState(new Date());
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (calendarValueFrom > calendarValueTo) {
      setCalendarValueTo(calendarValueFrom);
    }
  }, [calendarValueFrom]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <Paper sx={{ padding: 2 }}>
        <Stack spacing={2} mb={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptLocale}>
            <DatePicker
              label='Desde'
              disablePast
              minDate={new Date('2022-02-01')}
              value={calendarValueFrom}
              onChange={(newValue) => {
                setCalendarValueFrom(newValue as Date);
              }}
              renderInput={(params) => <TextField {...params} />}
              cancelText='Cancelar'
              okText='Continuar'
              shouldDisableDate={(date) => {
                let conflict = false;

                if (unavailabilities) {
                  unavailabilities.forEach((unavailability: any) => {
                    if (
                      isWithinInterval(date, {
                        start: new Date(unavailability.from),
                        end: new Date(unavailability.to),
                      })
                    ) {
                      conflict = true;
                    }
                  });
                }

                return conflict;
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptLocale}>
            <DatePicker
              label='Até'
              disablePast
              minDate={calendarValueFrom}
              value={calendarValueTo}
              onChange={(newValue) => {
                setCalendarValueTo(newValue as Date);
              }}
              shouldDisableDate={(date) => {
                let conflict = false;

                if (unavailabilities) {
                  unavailabilities.forEach((unavailability: any) => {
                    if (
                      isWithinInterval(date, {
                        start: new Date(unavailability.from),
                        end: new Date(unavailability.to),
                      })
                    ) {
                      conflict = true;
                    }
                  });
                }

                return conflict;
              }}
              renderInput={(params) => <TextField {...params} />}
              cancelText='Cancelar'
              okText='Continuar'
            />
          </LocalizationProvider>
          <Button
            variant='contained'
            onClick={async () => {
              try {
                await addUnavailabilityPeriod(
                  formatISO(set(calendarValueFrom, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })),
                  formatISO(set(calendarValueTo, { hours: 23, minutes: 59, seconds: 59, milliseconds: 0 }))
                );
                mutateUnavailabilities();
              } catch (error) {
                enqueueSnackbar('Existe um conflito entre as datas fornecidas e um registo anterior.', {
                  variant: 'error',
                });
              }
            }}
          >
            Adicionar
          </Button>
        </Stack>
        <Divider />
        {unavailabilities && (
          <List>
            {unavailabilities.map((unavailability: any, index: number) => (
              <ListItem
                key={`unavailability_${index}`}
                secondaryAction={
                  !isPast(parseISO(unavailability.from)) && (
                    <IconButton
                      edge='end'
                      aria-label='delete'
                      onClick={async () => {
                        await deleteUnavailabilityPeriod(unavailability.from, unavailability.to);
                        mutateUnavailabilities();
                      }}
                    >
                      <Delete />
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  id={`unavailability_list_item_${index}`}
                  primary={
                    <Stack>
                      <Box>
                        <Typography sx={{ display: 'inline' }} component='span' variant='body2' fontWeight='bold'>
                          Desde
                        </Typography>
                        <Typography sx={{ display: 'inline' }} component='span' variant='body2'>
                          {` ${format(parseISO(unavailability.from), 'PPPPp', { locale: ptLocale })}`}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ display: 'inline' }} component='span' variant='body2' fontWeight='bold'>
                          Até
                        </Typography>
                        <Typography sx={{ display: 'inline' }} component='span' variant='body2'>
                          {` ${format(parseISO(unavailability.to), 'PPPPp', { locale: ptLocale })}`}
                        </Typography>
                      </Box>
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Dialog>
  );
}
