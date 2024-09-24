import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import axios from 'axios';

import { Room } from '@/types/room';

import { socket } from '../../../socket';
import { AddMessage } from './add-message';
import { SystemMessages } from './systemMessages';

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL + ':' + import.meta.env.VITE_SERVER_PORT;

export function RoomMatrix(): React.JSX.Element {
  const [assetsState, setAssetsState] = React.useState<Room[]>([]);

  React.useEffect(() => {
    axios
      .get(`${API_BASE_URL}/roomStatus`)
      .then((res) => {
        setAssetsState(res.data);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      });

    socket.on('roomStatusUpdated', (updatedStatuses: Room[]) => {
      console.log('socket on:', updatedStatuses);
      setAssetsState(updatedStatuses);
    });

    return () => {
      socket.off('roomStatusUpdated');
    };
  }, []);

  const handleStatusChange = (nameRoom: string, newStatus: 'on' | 'off' | 'blink', id: string) => {
    setAssetsState((prevState) =>
      prevState.map((room) => (room.nameRoom === nameRoom ? { ...room, status: newStatus } : room))
    );
    axios
      .put(`${API_BASE_URL}/roomStatus/${id}`, {
        status: newStatus,
      })
      .then((response) => {
        console.log('Status updated:', response.data);
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  };

  return (
    <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', p: 4 }}>
      <Grid container spacing={3} sx={{ flex: 1, overflow: 'auto' }}>
        {assetsState.map((room) => (
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
