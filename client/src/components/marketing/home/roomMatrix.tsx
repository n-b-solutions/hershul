import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { socket } from '../../../socket'; 
 import { AddMessage } from './add-message'; 
import { fetchRooms, updateRoomStatus, setRoomStatusFromSocket } from '../../../state/room/room-slice'; // תעדכן את הנתיב
import { RootState, AppDispatch } from '../../../state/store'; 

export function RoomMatrix(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>(); // הגדרת dispatch עם טיפוס מתאים
  const { rooms } = useSelector((state: RootState) => state.rooms); // הוספת RootState ל-useSelector

  // שליפת החדרים כשמועלה הקומפוננטה
  React.useEffect(() => {
    dispatch(fetchRooms());

    // האזנה לסטטוס חדרים מה-socket ועדכון ה-state
    socket.on('roomStatusUpdated', (updatedStatuses) => {
      dispatch(setRoomStatusFromSocket(updatedStatuses));
    });

    // ניקוי האזנה ל-socket בעת יציאה
    return () => {
      socket.off('roomStatusUpdated');
    };
  }, [dispatch]);

  const handleStatusChange = (nameRoom: string, newStatus: 'on' | 'off' | 'blink', id: string) => {
    // Dispatch כדי לעדכן את סטטוס החדר
    dispatch(updateRoomStatus({ id, newStatus }));
  };

  return (
    <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', p: 4 }}>
      <Grid container spacing={3} sx={{ flex: 1, overflow: 'auto' }}>
        {rooms.map((room) => (
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
        ))}
      </Grid>
    </Box>
  );
}
