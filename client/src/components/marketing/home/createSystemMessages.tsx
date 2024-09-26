import * as React from 'react';
import { Dialog } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Unstable_Grid2';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { Room } from '@/types/room';
import { Option } from '@/components/core/option';
import AudioRecorder from './audioRecorder';

import { createMessageRoom, selectMessageRoomLoading } from '@/state/message-room/message-room-slice';
import type { AppDispatch } from '@/state/store';
import { API_BASE_URL } from '@/consts/api';

export function CreateSystemMessages(props: {
  open: boolean;
  handleClose: (id?: string) => void;
  room?: string;
}): React.JSX.Element {
  const [selectedRoom, setSelectedRoom] = React.useState<string>(props.room || '');
  const [name, setName] = React.useState<string>('');
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  const [rooms, setRooms] = React.useState<Room[]>([]); // Add state for rooms
  const { open, handleClose, room } = props;

  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectMessageRoomLoading);

  React.useEffect(() => {
    if (!open) {
      // Reset form fields when modal closes
      setSelectedRoom(room || '');
      setName('');
      setAudioBlob(null);
    }
  }, [open, room]);

  // Fetch rooms from the API when the component mounts
  React.useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/roomStatus`); // Adjust API endpoint as needed
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

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
      const newMessage = await dispatch(createMessageRoom(newRoom)).unwrap();
      handleClose(newMessage?.id);
    }
  };

  const isSaveDisabled = !name || !audioBlob;

  return (
    <Dialog open={open} onClose={() => handleClose()} onClick={(event)=> event.stopPropagation()}>
      <Box sx={{ p: 3 }}>
        <Box maxWidth="sm">
          <Grid container spacing={3}>
            <Grid sm={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Name</InputLabel>
                <OutlinedInput name="name" value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
            </Grid>

            <Grid sm={6} xs={12}>
              <FormControl fullWidth disabled={!!room}>
                <InputLabel>Room</InputLabel>
                <Select value={selectedRoom} onChange={handleRoomChange} input={<OutlinedInput label="Room" />}>
                  {rooms.map((room) => (
                    <Option key={room.id} value={room.nameRoom}>
                      {room.nameRoom}
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
            <Button onClick={() => handleClose()} variant="outlined" sx={{ mr: 1 }}>
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
