import * as React from 'react';
import { useEffect, useState } from 'react';
import { socket } from '@/socket';
import { Divider, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import axios from 'axios';

import { Minyan, MinyanApi } from '@/types/minyans.type';
import { dayjs } from '@/lib/dayjs';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';
import { API_BASE_URL } from '@/const/api.const';

const columns: ColumnDef<Minyan>[] = [
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
        {row.messages ? (
          <Tooltip title={row.messages}>
            <SpeakerIcon size={24} />
          </Tooltip>
        ) : null}
      </>
    ),
    name: 'Message',
    width: '70px',
  },
];

export function Schedule(): React.JSX.Element {
  const [allMinyans, setAllMinyans] = useState<Minyan[]>([]);
  const [minyans, setMinyans] = useState<Minyan[]>([]);

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

    const sortMinyans = (data: Minyan[]) => {
      return data.sort((a, b) => {
        const timeA = dayjs(a.startDate).hour() * 60 + dayjs(a.startDate).minute();
        const timeB = dayjs(b.startDate).hour() * 60 + dayjs(b.startDate).minute();

        if (timeA === timeB) {
          if (a.action === 'blink' && b.action === 'on') {
            return -1;
          }
          if (a.action === 'on' && b.action === 'blink') {
            return 1;
          }
        }

        return timeA - timeB;
      });
    };

    setMinyans(sortMinyans(filteredMinyans));
  }, []);

  useEffect(() => {
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
  }, [filterMinyans]);

  useEffect(() => {
    const interval = setInterval(() => {
      filterMinyans(allMinyans);
    }, 60000);
    return () => clearInterval(interval);
  }, [allMinyans, filterMinyans]);

  return (
    <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CardHeader title="Schedule" />
        <Divider />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {minyans.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="h6" color="text.secondary">
                No action expected in the next two hours
              </Typography>
            </Box>
          ) : (
            <DataTable<Minyan> columns={columns} rows={minyans} />
          )}
        </Box>
      </Card>
    </Box>
  );
}
