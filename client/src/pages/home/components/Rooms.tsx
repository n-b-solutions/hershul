import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useDispatch, useSelector } from 'react-redux';

import { AddMessageButton } from '@/components/message/AddMessageButton';

import { eBulbStatus } from '../../../../../lib/types/room.type';
import { fetchRooms, setRoomStatusFromSocket, updateRoomStatus } from '../../../redux/room/room-slice'; // תעדכן את הנתיב
import { AppDispatch, RootState } from '../../../redux/store';
import { socket } from '../../../socket';

export function Rooms(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms } = useSelector((state: RootState) => state.room);

  React.useEffect(() => {
    const getRooms = async () => {
      if (!rooms.length) {
        await dispatch(fetchRooms());
      }
    };
    getRooms();

    socket.on('roomStatusUpdated', (updatedStatuses) => {
      dispatch(setRoomStatusFromSocket(updatedStatuses));
    });

    return () => {
      socket.off('roomStatusUpdated');
    };
  }, []);

  const handleStatusChange = (newStatus: eBulbStatus, id: string) => {
    dispatch(updateRoomStatus({ id, newStatus }));
  };

  return (
    <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', p: 4 }}>
      <Grid container spacing={3} sx={{ flex: 1, overflow: 'auto' }}>
        {rooms.length ? (
          rooms.map((room) => (
            <Grid key={room.id} xs={12} sm={12} md={6} lg={6}>
              <Card>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '70px',
                    justifyContent: 'center',
                  }}
                >
                  <Typography noWrap variant="subtitle2">
                    {room.name}
                  </Typography>
                </Box>
                <CardContent sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    {...(room.bulbStatus === eBulbStatus.on
                      ? { variant: 'contained', color: 'success' }
                      : { variant: 'outlined', color: 'secondary' })}
                    sx={{ margin: '5px' }}
                    onClick={() => handleStatusChange(eBulbStatus.on, room.id)}
                  >
                    ON
                  </Button>
                  <Button
                    {...(room.bulbStatus === eBulbStatus.off
                      ? { variant: 'contained', color: 'error' }
                      : { variant: 'outlined', color: 'secondary' })}
                    sx={{ margin: '5px' }}
                    onClick={() => handleStatusChange(eBulbStatus.off, room.id)}
                  >
                    OFF
                  </Button>
                  <Button
                    {...(room.bulbStatus === eBulbStatus.blink
                      ? { variant: 'contained', color: 'warning' }
                      : { variant: 'outlined', color: 'secondary' })}
                    sx={{ margin: '5px' }}
                    onClick={() => handleStatusChange(eBulbStatus.blink, room.id)}
                  >
                    BLINK
                  </Button>
                </CardContent>
                <Divider />
                <AddMessageButton roomName={room.name} />
              </Card>
            </Grid>
          ))
        ) : (
          <h3>Loading rooms...</h3>
        )}
      </Grid>
    </Box>
  );
}
