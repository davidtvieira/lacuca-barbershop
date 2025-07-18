import { EventBusy, Schedule } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import UnavailablePeriodsDialog from './UnavailablePeriodsDIalog';
import WeeklyScheduleDialog from './WeeklyScheduleDialog';

export default function AppointmentsPanelTopBar() {
  const [unavailablePeriosDialogOpen, setUnavailablePeriosDialogOpen] = useState(false);
  const [weeklyScheduleDialogOpen, setWeeklyScheduleDialogOpen] = useState(false);

  function handleUnavailablePeriosDialogClose() {
    setUnavailablePeriosDialogOpen(false);
  }

  function handleWeeklyScheduleDialogClose() {
    setWeeklyScheduleDialogOpen(false);
  }

  return (
    <Stack direction='row' justifyContent='flex-end' mb={1} spacing={1}>
      <Button variant='outlined' startIcon={<EventBusy />} onClick={() => setUnavailablePeriosDialogOpen(true)}>
        Períodos de indisponibilidade
      </Button>
      <Button variant='outlined' startIcon={<Schedule />} onClick={() => setWeeklyScheduleDialogOpen(true)}>
        Horário semanal
      </Button>
      <UnavailablePeriodsDialog open={unavailablePeriosDialogOpen} handleClose={handleUnavailablePeriosDialogClose} />
      <WeeklyScheduleDialog open={weeklyScheduleDialogOpen} handleClose={handleWeeklyScheduleDialogClose} />
    </Stack>
  );
}
