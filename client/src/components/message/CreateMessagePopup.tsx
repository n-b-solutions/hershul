import * as React from 'react';
import { messageLoading } from '@/redux/message/messageSlice';
import { createMessage } from '@/redux/message/messageThunk';
import type { AppDispatch } from '@/redux/store';
import { Dialog } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Unstable_Grid2';
import { useDispatch, useSelector } from 'react-redux';

import { fetchRooms, selectRooms, selectRoomsLoading } from '../../redux/room/room-slice';
import AudioRecorder from './AudioRecorder';

export const CreateMessagePopup = ({
  open,
  handleClose,
  room,
}: {
  open: boolean;
  handleClose: (id?: string) => void;
  room?: string;
}): React.JSX.Element => {
  const [selectedRoom, setSelectedRoom] = React.useState<string>(room || '');
  const [name, setName] = React.useState<string>('');
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const rooms = useSelector(selectRooms); // Fetch rooms from Redux store
  const loading = useSelector(messageLoading);
  const roomsLoading = useSelector(selectRoomsLoading); // Check if rooms are loading
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
      handleClose(newMessage?.id);
    }
  };

  React.useEffect(() => {
    if (!open) {
      // Reset form fields when modal closes
      setSelectedRoom(room || '');
      setName('');
      setAudioBlob(null);
    }
  }, [open, room]);

  // Fetch rooms from Redux when the component mounts
  React.useEffect(() => {
    const getRooms = async () => {
      if (!rooms) {
        await dispatch(fetchRooms());
      }
    };
    getRooms();
  }, []);

  return (
    <Dialog open={open} onClose={() => handleClose()} onClick={(event) => event.stopPropagation()}>
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
};
