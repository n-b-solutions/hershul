import * as React from 'react';
import { messageLoading } from '@/redux/message/messageSlice';
import { createMessage } from '@/redux/message/messageThunk';
import type { AppDispatch } from '@/redux/store';
import { SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';

import { fetchRooms, selectRooms, selectRoomsLoading } from '../../redux/room/room-slice';
import AudioRecorder from './AudioRecorder';

export const CreateMessagePopup = ({
  onFinish,
  room,
  isLastStep,
}: {
  onFinish: (id?: string) => void;
  room?: string;
  isLastStep: boolean;
}): React.JSX.Element => {
  const [selectedRoom, setSelectedRoom] = React.useState<string>(room || '');
  const [name, setName] = React.useState<string>('');
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  const [showInputs, setShowInputs] = React.useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const rooms = useSelector(selectRooms);
  const loading = useSelector(messageLoading);
  const roomsLoading = useSelector(selectRoomsLoading);

  const handleRoomChange = (event: SelectChangeEvent<string>) => {
    setSelectedRoom(event.target.value);
  };

  const handleSave = async (audioBlob: Blob | null) => {
    if (audioBlob) {
      if (showInputs) {
        const newRoom = {
          selectedRoom,
          name,
          audioBlob,
        };
        const newMessage = await dispatch(createMessage(newRoom));
        onFinish(newMessage?.id);
      } else {
        setShowInputs(true);
      }
    }
  };

  const handleRedo = () => {
    setAudioBlob(null);
    setShowInputs(false);
    onFinish('redo');
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
    <Box sx={{ bgcolor: 'transparent', p: 3, display: 'flex', justifyContent: 'center' }}>
      <Box maxWidth="sm" sx={{ px: 3, py: 2 }}>
        <AudioRecorder
          onSave={handleSave}
          onRedo={handleRedo}
          showInputs={showInputs}
          name={name}
          setName={setName}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          rooms={rooms}
          roomsLoading={roomsLoading}
          isLastStep={isLastStep}
        />
      </Box>
    </Box>
  );
};
