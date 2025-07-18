import {
  Button,
  Dialog,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { FieldArray, Form, Formik, getIn } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { updateWeeklySchedule } from '../../../lib/api';
import { useSnackbar } from 'notistack';

const week = [
  { label: 'Domingo', id: 'dom' },
  { label: 'Segunda-feira', id: 'seg' },
  { label: 'Terça-feira', id: 'ter' },
  { label: 'Quarta-feira', id: 'qua' },
  { label: 'Quinta-feira', id: 'qui' },
  { label: 'Sexta-feira', id: 'sex' },
  { label: 'Sábado', id: 'sab' },
];

export default function WeeklyScheduleDialog({ open, handleClose }: { open: boolean; handleClose: any }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = yup.object().shape({
    weeklySchedule: yup
      .array()
      .of(
        yup.object().shape({
          from: yup.number().positive().min(1).max(24).required(),
          to: yup.number().positive().min(1).max(24).required(),
          breaks: yup.array().of(yup.number().positive().min(1).max(24)).max(24),
          available: yup.boolean().required(),
        })
      )
      .length(7)
      .required(),
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <Paper sx={{ padding: 2 }}>
        <Formik
          initialValues={{
            weeklySchedule: session?.user.extraInfo.weeklySchedule,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              await updateWeeklySchedule(values.weeklySchedule);
              enqueueSnackbar('Horário semanal atualizado com sucesso!', { variant: 'success' });
              router.reload();
            } catch (error) {
              enqueueSnackbar('Não foi possível atualizar o horário semanal.', { variant: 'error' });
            }
          }}
        >
          {(props) => (
            <Form noValidate>
              <FieldArray
                name='weeklySchedule'
                render={() => (
                  <>
                    {props.values.weeklySchedule &&
                      props.values.weeklySchedule.length > 0 &&
                      props.values.weeklySchedule.map((weekDay, index: number) => {
                        const from = `weeklySchedule[${index}].from`;
                        const fromTouched = getIn(props.touched, from);
                        const fromError = getIn(props.errors, from);

                        const to = `weeklySchedule[${index}].to`;
                        const toTouched = getIn(props.touched, to);
                        const toError = getIn(props.errors, to);

                        const breaks = `weeklySchedule[${index}].breaks`;
                        const breaksTouched = getIn(props.touched, breaks);
                        const breaksError = getIn(props.errors, breaks);

                        const available = `weeklySchedule[${index}].available`;

                        return (
                          <Paper key={`weeklySchedule_${index}`} sx={{ padding: 2, mb: 1 }}>
                            <Typography fontWeight='light' fontSize='14px' gutterBottom>
                              {week[index].label}
                            </Typography>
                            <Stack direction='row' spacing={1}>
                              <TextField
                                id={from}
                                name={from}
                                label='Horas de entrada'
                                variant='filled'
                                size='small'
                                fullWidth
                                sx={{ mb: 2 }}
                                // @ts-ignore
                                value={weekDay.from}
                                error={Boolean(fromTouched && fromError)}
                                helperText={fromTouched && fromError ? 'Introduza um número entre 1 e 24' : ''}
                                onChange={props.handleChange}
                              />
                              <TextField
                                id={to}
                                name={to}
                                label='Horas de saída'
                                variant='filled'
                                size='small'
                                fullWidth
                                sx={{ mb: 2 }}
                                // @ts-ignore
                                value={weekDay.to}
                                error={Boolean(toTouched && toError)}
                                helperText={toTouched && toError ? 'Introduza um número entre 1 e 24' : ''}
                                onChange={props.handleChange}
                              />
                            </Stack>
                            <TextField
                              id={breaks}
                              name={breaks}
                              label='Horas de pausa'
                              variant='filled'
                              size='small'
                              fullWidth
                              sx={{ mb: 2 }}
                              // @ts-ignore
                              value={weekDay.breaks}
                              error={Boolean(breaksTouched && breaksError)}
                              helperText={
                                breaksTouched && breaksError
                                  ? 'Introduza as horas separadas por vírgulas e dentro de [ ] (números entre 1 e 24) <exemplo: [12,13]>'
                                  : ''
                              }
                              onChange={props.handleChange}
                            />
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    id={available}
                                    name={available}
                                    checked={weekDay.available}
                                    onChange={props.handleChange}
                                  />
                                }
                                label='Disponível'
                              />
                            </FormGroup>
                          </Paper>
                        );
                      })}
                  </>
                )}
              />
              <Button variant='contained' type='submit' fullWidth>
                Atualizar
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Dialog>
  );
}
