import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import { Dialog } from '@mui/material';
import AudioRecorder from './audioRecorder';
import { Option } from '@/components/core/option';

interface Room {
  id: string;
  room: string;
}

const rooms = [
  { id: '1', room: 'Room 1' },
  { id: '2', room: 'Room 2' },
  { id: '3', room: 'Room 3' },
  { id: '4', room: 'Room 4' },
  { id: '5', room: 'Room 5' },
  { id: '6', room: 'Room 6' }
] satisfies Room[];

export function CreateSystemMessages(props: { open: boolean; handleClose: () => void }): React.JSX.Element {
  const [selectedRoom, setSelectedRoom] = React.useState<string>('');
  const { open, handleClose } = props;

  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box sx={{ p: 3 }}>
        <Box maxWidth="sm">
          <Grid container spacing={3}>
            <Grid sm={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Name</InputLabel>
                <OutlinedInput name="name" />
              </FormControl>
            </Grid>

            <Grid sm={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Room</InputLabel>
                <Select value={selectedRoom} onChange={handleRoomChange}>
                  <Option value="">Select a room</Option>
                  {rooms.map((room) => (
                    <Option key={room.id} value={room.id}>
                      {room.room}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid sm={12} xs={12}>
              <AudioRecorder />
            </Grid>

            <Grid sm={12} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleClose}>Save</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
}
