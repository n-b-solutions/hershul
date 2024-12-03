import { Chip, Tooltip, Typography } from '@mui/material';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import { X as CloseIcon } from '@phosphor-icons/react/dist/ssr/X';
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
        color={
          row.action === 'on'
            ? 'success'
            : row.action === 'off'
              ? 'error'
              : row.action === 'blink'
                ? 'warning'
                : 'default'
        }
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
