import * as React from 'react';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/const/api.const';
import { socket } from '@/socket';
import { Divider } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import axios from 'axios';

import { ScheduleActionType } from '@/types/minyans.type';
import { dayjs } from '@/lib/dayjs';
import { DataTable } from '@/components/core/DataTable';

import { columns } from '../config/schedule.config';
import { MinyanType } from '../../../../../lib/types/minyan.type';

export function Schedule(): React.JSX.Element {
  const [allScheduleActions, setAllScheduleActions] = useState<ScheduleActionType[]>([]);
  const [nextScheduleActions, setNextScheduleActions] = useState<ScheduleActionType[]>([]);

  const mapMinyansToScheduleActions = (data: MinyanType[]) => {
    return data.reduce<ScheduleActionType[]>((acc, minyan) => {
      const roomName = minyan.room?.name;
      const time = new Date(minyan.startDate.time);
      const endDate = new Date(minyan.endDate.time);
      const onAction = {
        minyanId: minyan.id,
        roomName,
        message: minyan.startDate.message?.name ?? '',
        time,
        action: 'on',
      };

      const offAction = {
        minyanId: minyan.id,
        roomName,
        message: minyan.endDate.message?.name ?? '',
        time: endDate,
        action: 'off',
      };

      const blinkActions = minyan.blink
        ? [
            {
              minyanId: minyan.id,
              roomName,
              message: minyan.blink.message?.name ?? '',
              time: new Date(time.getTime() - minyan.blink.secondsNum * 1000),
              action: 'blink',
            },
          ]
        : [];

      return [...acc, onAction, offAction, ...blinkActions];
    }, []);
  };

  const filterNextActions = React.useCallback((scheduleActions: ScheduleActionType[]) => {
    const now = dayjs();
    const currentMinutesOfDay = now.hour() * 60 + now.minute();
    const minutesInTwoHours = currentMinutesOfDay + 2 * 60;

    const filteredMinyans = scheduleActions.filter((scheduleAction) => {
      const minyanTime = dayjs(scheduleAction.time);
      const minyanMinutesOfDay = minyanTime.hour() * 60 + minyanTime.minute();

      return minyanMinutesOfDay > currentMinutesOfDay && minyanMinutesOfDay <= minutesInTwoHours;
    });

    const sortActions = (scheduleActions: ScheduleActionType[]) => {
      return scheduleActions.sort((a, b) => {
        const timeA = dayjs(a.time).hour() * 60 + dayjs(a.time).minute();
        const timeB = dayjs(b.time).hour() * 60 + dayjs(b.time).minute();

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

    setNextScheduleActions(sortActions(filteredMinyans));
  }, []);

  useEffect(() => {
    axios
      .get<MinyanType[]>(`${API_BASE_URL}/schedule`)
      .then((res) => {
        const scheduleActions = mapMinyansToScheduleActions(res.data);
        setAllScheduleActions(scheduleActions);
        filterNextActions(scheduleActions);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });

    socket.on('minyanUpdated', (updatedMinyans) => {
      const scheduleActions = mapMinyansToScheduleActions(updatedMinyans);
      setAllScheduleActions(scheduleActions);
      filterNextActions(scheduleActions);
    });

    return () => {
      socket.off('minyanUpdated');
    };
  }, [filterNextActions]);

  useEffect(() => {
    const interval = setInterval(() => {
      filterNextActions(allScheduleActions);
    }, 60000);
    return () => clearInterval(interval);
  }, [allScheduleActions, filterNextActions]);

  return (
    <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CardHeader title="Schedule" />
        <Divider />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {nextScheduleActions.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="h6" color="text.secondary">
                No action expected in the next two hours
              </Typography>
            </Box>
          ) : (
            <DataTable<ScheduleActionType> columns={columns} rows={nextScheduleActions} />
          )}
        </Box>
      </Card>
    </Box>
  );
}
