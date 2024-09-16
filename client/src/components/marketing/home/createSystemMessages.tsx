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
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../state/store';
import { createMessageRoom, selectMessageRoomLoading } from '../../../state/message-room/message-room-slice';
import Tooltip from '@mui/material/Tooltip';
import { useLocation } from 'react-router-dom';

interface Room {
  id: string;
  room: string;
}

const rooms = [
  { id: '1', room: 'room1' },
  { id: '2', room: 'room2' },
  { id: '3', room: 'room3' },
  { id: '4', room: 'room4' },
  { id: '5', room: 'room5' },
  { id: '6', room: 'room6' }
] satisfies Room[];

export function CreateSystemMessages(props: { open: boolean; handleClose: () => void; room?: string }): React.JSX.Element {
  const [selectedRoom, setSelectedRoom] = React.useState<string>(props.room || '');
  const [name, setName] = React.useState<string>('');
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  const { open, handleClose, room } = props;

  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectMessageRoomLoading);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  React.useEffect(() => {
    if (!open) {
      // Reset form fields when modal closes
      setSelectedRoom(room || '');
      setName('');
      setAudioBlob(null);
    }
  }, [open, room]);

  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value);
  };

  const handleSave = async () => {
    if (audioBlob) {
      const newRoom = {
        selectedRoom,
        name,
        audioBlob,
      };

      dispatch(createMessageRoom(newRoom));
      handleClose();
    }
  };

  const isSaveDisabled = !name || !audioBlob;

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box sx={{ p: 3 }}>
        <Box maxWidth="sm">
          <Grid container spacing={3}>
            <Grid sm={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Name</InputLabel>
                <OutlinedInput
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
            </Grid>

            <Grid sm={6} xs={12}>
              <FormControl fullWidth disabled={!!room}>
                <InputLabel>Room</InputLabel>
                <Select
                  value={selectedRoom}
                  onChange={handleRoomChange}
                  input={<OutlinedInput label="Room" />}
                >
                  {rooms.map((room) => (
                    <Option key={room.id} value={room.room}>
                      {room.room}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <AudioRecorder onSave={(blob) => setAudioBlob(blob)} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleClose} variant="outlined" sx={{ mr: 1 }}>
              Cancel
            </Button>
            {isSaveDisabled || loading ? (
              <Tooltip title="Please fill all the new audio details" arrow>
                <span>
                  <Button onClick={handleSave} variant="contained" disabled={isSaveDisabled || loading}>
                    Save
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Button onClick={handleSave} variant="contained" disabled={isSaveDisabled || loading}>
                Save
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
