import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import {
  Microphone as MicrophoneIcon,
  ArrowCounterClockwise as RedoIcon,
  FloppyDisk as SaveIcon,
  Stop as StopIcon,
} from '@phosphor-icons/react';

interface AudioRecorderProps {
  onSave: (audioBlob: Blob | null) => void;
  onRedo: () => void;
  showInputs: boolean;
  name: string;
  setName: (name: string) => void;
  selectedRoom: string;
  setSelectedRoom: (room: string) => void;
  rooms: { id: string; name: string }[];
  roomsLoading: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onSave,
  onRedo,
  showInputs,
  name,
  setName,
  selectedRoom,
  setSelectedRoom,
  rooms,
  roomsLoading,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          const blob = new Blob([event.data], { type: 'audio/wav' });
          setAudioBlob(blob);
          setAudioURL(URL.createObjectURL(blob));
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing audio devices.', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const handleRedo = () => {
    setAudioBlob(null);
    setAudioURL(null);
    setRecordingDuration(0);
    onRedo();
  };

  const handleSave = () => {
    if (audioBlob) {
      onSave(audioBlob);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <IconButton
          onClick={isRecording ? stopRecording : audioBlob ? handleRedo : startRecording}
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: isRecording ? 'error.main' : 'primary.main',
            color: 'white',
            zIndex: 2,
            '&:hover': {
              bgcolor: isRecording ? 'error.dark' : 'primary.dark',
            },
          }}
        >
          {isRecording ? <StopIcon size={24} /> : <MicrophoneIcon size={24} />}
        </IconButton>
        {isRecording && (
          <CircularProgress
            variant="determinate"
            value={(recordingDuration % 60) * (100 / 60)}
            size={140}
            thickness={1}
            sx={{
              position: 'absolute',
              top: -20,
              left: -20,
              zIndex: 1,
              color: 'rgba(255, 0, 0, 0.5)',
            }}
          />
        )}
      </Box>
      {isRecording && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          {formatDuration(recordingDuration)}
        </Typography>
      )}
      {audioBlob && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {formatDuration(recordingDuration)}
          </Typography>
          <audio controls src={audioURL || undefined} style={{ marginTop: 16, width: '75%' }} />
          <Box>
            {showInputs && (
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Name</InputLabel>
                  <OutlinedInput name="name" value={name} onChange={(e) => setName(e.target.value)} />
                </FormControl>
                <FormControl fullWidth disabled={!!selectedRoom}>
                  <InputLabel>Room</InputLabel>
                  <Select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    input={<OutlinedInput label="Room" />}
                  >
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
              </Box>
            )}
            <Button onClick={handleSave} startIcon={<SaveIcon />}>
              Save
            </Button>
            <Button onClick={handleRedo} startIcon={<RedoIcon />}>
              Redo
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AudioRecorder;
