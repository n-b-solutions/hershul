'use client';

import * as React from 'react';
import { socket } from '@/socket';
import { Divider, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import axios from 'axios';

import { Minyan, MinyanApi } from '@/types/minyanim';
import { dayjs } from '@/lib/dayjs';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';

const API_BASE_URL = import.meta.env.VITE_LOCAL_SERVER;

export function ListMinyan(): React.JSX.Element {
  const [allMinyans, setAllMinyans] = React.useState<Minyan[]>([]);
  const [minyans, setMinyans] = React.useState<Minyan[]>([]);

  React.useEffect(() => {
    axios
      .get<MinyanApi[]>(`${API_BASE_URL}/minyan/getMinyanimByDateType`)

      .then((res) => {
        const processedMinyans = processMinyanData(res.data);
        setAllMinyans(processedMinyans);
        filterMinyans(processedMinyans);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });

    socket.on('minyanUpdated', (updatedMinyans) => {
      const processedMinyans = processMinyanData(updatedMinyans);
      setAllMinyans(processedMinyans);
      filterMinyans(processedMinyans);
    });

    return () => {
      socket.off('minyanUpdated');
    };
  }, []);

  const processMinyanData = (data: MinyanApi[]) => {
    return data.reduce<Minyan[]>((acc, minyan) => {
      const roomName = minyan.room.nameRoom;
      const startDate = new Date(minyan.startDate.time);
      const endDate = new Date(minyan.endDate.time);
      const onAction = {
        roomName,
        messages: minyan.startDate.message?.name ?? '',
        startDate,
        action: 'on',
      };

      const offAction = {
        roomName,
        messages: minyan.endDate.message?.name ?? '',
        startDate: endDate,
        action: 'off',
      };

      const blinkActions = minyan.blink
        ? [
            {
              roomName,
              messages: minyan.blink.message?.name ?? '',
              startDate: new Date(startDate.getTime() - minyan.blink.secondsNum * 1000),
              action: 'blink',
            },
          ]
        : [];

      return [...acc, onAction, offAction, ...blinkActions];
    }, []);
  };

  const filterMinyans = React.useCallback((data: Minyan[]) => {
    const now = dayjs();
    const currentMinutesOfDay = now.hour() * 60 + now.minute();
    const minutesInTwoHours = currentMinutesOfDay + 2 * 60;

    const filteredMinyans = data.filter((minyan) => {
      const minyanTime = dayjs(minyan.startDate);
      const minyanMinutesOfDay = minyanTime.hour() * 60 + minyanTime.minute();

      return minyanMinutesOfDay > currentMinutesOfDay && minyanMinutesOfDay <= minutesInTwoHours;
    });

    const sortMinyans = filteredMinyans.sort((a, b) => {
      const timeA = dayjs(a.startDate).hour() * 60 + dayjs(a.startDate).minute();
      const timeB = dayjs(b.startDate).hour() * 60 + dayjs(b.startDate).minute();

      return timeA - timeB;
    });

    setMinyans(sortMinyans);

    console.log(filteredMinyans);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      filterMinyans(allMinyans);
    }, 60000);
    return () => clearInterval(interval);
  }, [allMinyans, filterMinyans]);

  const columns = [
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Typography color="text.secondary" suppressHydrationWarning sx={{ whiteSpace: 'nowrap' }} variant="body2">
            {dayjs(row.startDate).format('hh:mm A')}
          </Typography>
        </div>
      ),
      name: 'Time',
      width: '70px',
    },
    {
      formatter: (row): React.JSX.Element => (
        <div>
          <Typography sx={{ whiteSpace: 'nowrap' }} variant="subtitle2">
            {row.action}
          </Typography>
        </div>
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
      formatter: (row): React.JSX.Element => {
        return (
          <>
            {row.messages ? (
              <Tooltip title={row.messages}>
                <SpeakerIcon size={24} />
              </Tooltip>
            ) : null}
          </>
        );
      },
      name: 'Message',
      width: '70px',
    },
  ] satisfies ColumnDef<Minyan>[];

  return (
    <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CardHeader title="Schedule" />
        <Divider />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <DataTable<Minyan> columns={columns} rows={minyans} />
        </Box>
      </Card>
    </Box>
  );
}
