import { Chip, Tooltip, Typography } from '@mui/material';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
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
    formatter: (row): React.JSX.Element => (
      <Chip
        label={row.action}
        sx={{
          backgroundColor:
            row.action === 'on'
              ? 'green'
              : row.action === 'off'
                ? 'red'
                : row.action === 'blink'
                  ? 'yellow'
                  : 'default',
          color: 'white',
        }}
      />
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
