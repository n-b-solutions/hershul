import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useDispatch, useSelector } from 'react-redux';

import { socket } from '../../../socket';
import { fetchRooms, setRoomStatusFromSocket, updateRoomStatus } from '../../../state/room/room-slice'; // תעדכן את הנתיב
import { AppDispatch, RootState } from '../../../state/store';
import { AddMessage } from './add-message';

export function RoomMatrix(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms } = useSelector((state: RootState) => state.rooms);

  React.useEffect(() => {
    const getRooms = async () => {
      if (!rooms) {
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

  const handleStatusChange = (nameRoom: string, newStatus: 'on' | 'off' | 'blink', id: string) => {
    dispatch(updateRoomStatus({ id, newStatus }));
  };

  return (
    <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', p: 4 }}>
      <Grid container spacing={3} sx={{ flex: 1, overflow: 'auto' }}>
        {rooms.length ? (
          rooms.map((room) => (
            <Grid key={room.nameRoom} xs={12} sm={12} md={6} lg={6}>
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
                    {room.nameRoom}
                  </Typography>
                </Box>
                <CardContent sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant={room.status === 'on' ? 'contained' : 'outlined'}
                    sx={{ margin: '5px' }}
                    onClick={() => handleStatusChange(room.nameRoom, 'on', room.id)}
                  >
                    ON
                  </Button>
                  <Button
                    variant={room.status === 'off' ? 'contained' : 'outlined'}
                    sx={{ margin: '5px' }}
                    onClick={() => handleStatusChange(room.nameRoom, 'off', room.id)}
                  >
                    OFF
                  </Button>
                  <Button
                    variant={room.status === 'blink' ? 'contained' : 'outlined'}
                    sx={{ margin: '5px' }}
                    onClick={() => handleStatusChange(room.nameRoom, 'blink', room.id)}
                  >
                    BLINK
                  </Button>
                </CardContent>
                <Divider />
                <AddMessage roomName={room.nameRoom} />
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
