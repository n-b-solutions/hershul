import { Tooltip, Typography } from '@mui/material';
import { LightbulbFilament, Power as OnIcon, SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';

import { ScheduleActionType } from '@/types/minyans.type';
import { ColumnDef } from '@/types/table.type';

export const columns: ColumnDef<ScheduleActionType>[] = [
  {
    formatter: (row): React.JSX.Element => (
      <div>
        <Typography color="text.secondary" suppressHydrationWarning sx={{ whiteSpace: 'nowrap' }} variant="body2">
          {dayjs(row.time).format('hh:mm A')}
        </Typography>
      </div>
    ),
    name: 'Time',
    width: '70px',
  },
  {
    formatter: (row): React.JSX.Element =>
      row.action === 'on' ? (
        <OnIcon size={20} color="green" />
      ) : row.action === 'off' ? (
        <OnIcon size={20} color="red" />
      ) : row.action === 'blink' ? (
        <LightbulbFilament size={20} color="orange"/>
      ) : (
        <div />
      ),
    name: 'Action',
    width: '70px',
  },

  {
    formatter: (row): React.JSX.Element => (
      <div>
        <Typography sx={{ whiteSpace: 'nowrap' }} variant="subtitle2">
          {row.roomName}
        </Typography>
      </div>
    ),
    name: 'Room',
    width: '70px',
  },
  {
    formatter: (row): React.JSX.Element => (
      <>
        {row.message ? (
          <Tooltip title={row.message}>
            <SpeakerIcon size={24} />
          </Tooltip>
        ) : null}
      </>
    ),
    name: 'Message',
    width: '70px',
  },
];
