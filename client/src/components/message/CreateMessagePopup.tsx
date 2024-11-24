import * as React from 'react';
import { messageLoading } from '@/redux/message/messageSlice';
import { createMessage } from '@/redux/message/messageThunk';
import type { AppDispatch } from '@/redux/store';
import { Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { ArrowCounterClockwise as RedoIcon, FloppyDisk as SaveIcon } from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchRooms, selectRooms, selectRoomsLoading } from '../../redux/room/room-slice';
import AudioRecorder from './AudioRecorder';

export const CreateMessagePopup = ({
  onFinish,
  room,
}: {
  onFinish: (id?: string) => void;
  room?: string;
}): React.JSX.Element => {
  const [selectedRoom, setSelectedRoom] = React.useState<string>(room || '');
  const [name, setName] = React.useState<string>('');
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const rooms = useSelector(selectRooms);
  const loading = useSelector(messageLoading);
  const roomsLoading = useSelector(selectRoomsLoading);
  const isSaveDisabled = !name || !audioBlob;

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
      const newMessage = await dispatch(createMessage(newRoom));
      onFinish(newMessage?.id);
    }
  };

  const handleRedo = () => {
    setAudioBlob(null);
  };

  React.useEffect(() => {
    if (!room) {
      setSelectedRoom('');
      setName('');
      setAudioBlob(null);
    }
  }, [room]);

  React.useEffect(() => {
    const getRooms = async () => {
      if (!rooms) {
        await dispatch(fetchRooms());
      }
    };
    getRooms();
  }, []);

  return (
    <Box sx={{ bgcolor: 'transparent', p: 3, display: 'flex' }}>
      <Box maxWidth="sm" sx={{ px: 3, py: 2 }}>
        <Grid container spacing={3} justifyContent="center">
          {audioBlob && (
            <>
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
                    {roomsLoading ? (
                      <MenuItem value="" disabled>
                        Loading rooms...
                      </MenuItem>
                    ) : (
                      rooms.map((room) => (
                        <MenuItem key={room.id} value={room.name}>
                          {room.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
        <Box sx={{ mt: 3 }}>
          {audioBlob ? (
            <Box sx={{ display: 'flex', gap: 12, mt: '113%' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isSaveDisabled || loading}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleRedo} startIcon={<RedoIcon />}>
                Redo
              </Button>
            </Box>
          ) : (
            <AudioRecorder onSave={(blob) => setAudioBlob(blob)} onRedo={handleRedo} />
          )}
        </Box>
      </Box>
    </Box>
  );
};
