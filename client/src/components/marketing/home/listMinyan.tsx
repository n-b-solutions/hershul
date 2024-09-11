'use client';

import * as React from 'react';
import { Divider, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import axios from 'axios';

import { Room } from '@/types/room';
import { dayjs } from '@/lib/dayjs';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';

interface MinyanApi {
  room: Room;
  messages: string;
  announcement: boolean;
  startDate: Date;
  endDate: Date;
}

interface Minyan {
  roomName: string;
  messages: string;
  announcement: boolean;
  startDate: Date;
  endDate: Date;
}
const API_BASE_URL = import.meta.env.VITE_LOCAL_SERVER;
export function ListMinyan(): React.JSX.Element {
  const [minyans, setMinyans] = React.useState<Minyan[]>([]);

  React.useEffect(() => {
    axios
      .get<MinyanApi[]>(`${API_BASE_URL}/minyan`)
      .then((res) => {
        const minyansData = res.data?.map((minyanApi) => {
          const {
              room: { nameRoom: roomName },
              ...minyan
          } = minyanApi;
          return { ...minyan, roomName };
        });
        console.log(minyansData);
        setMinyans(minyansData);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });
  }, []);

  const columns = [
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Typography color="text.secondary" suppressHydrationWarning sx={{ whiteSpace: 'nowrap' }} variant="body2">
            {dayjs(row.startDate).format('hh:mm A')}
          </Typography>
        </div>
      ),
      name: 'Start time',
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
      formatter: (row): React.JSX.Element => {
        return (
          <>
            {row.announcement ? (
              <Tooltip title={row.messages}>
                <IconButton>
                  <SpeakerIcon />
                </IconButton>
              </Tooltip>
            ) : null}
          </>
        );
      },
      name: 'Status',
      width: '70px',
    },
  ] satisfies ColumnDef<Minyan>[];

  return (
    <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CardHeader title="Next Minyans" />
        <Divider />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <DataTable<Minyan> columns={columns} rows={minyans} />
        </Box>
      </Card>
    </Box>
  );
}
