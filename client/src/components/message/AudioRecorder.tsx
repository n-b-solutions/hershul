import React, { useState, useRef } from 'react';
import { Box, IconButton, Button } from '@mui/material';
import { Microphone as MicrophoneIcon, Stop as StopIcon, FloppyDisk as SaveIcon, ArrowCounterClockwise as RedoIcon } from '@phosphor-icons/react';

interface AudioRecorderProps {
    onSave: (audioBlob: Blob | null) => void;
    onRedo: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSave, onRedo }) => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

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
        } catch (err) {
            console.error('Error accessing audio devices.', err);
        }
    };
    
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <IconButton
                onClick={isRecording ? stopRecording : startRecording}
                sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: '#3f51b5',
                    color: '#fff',
                    mb: 2,
                }}
            >
                {isRecording ? <StopIcon size={24} /> : <MicrophoneIcon size={24} />}
            </IconButton>
            {audioURL && (
                <>
                    <audio controls src={audioURL} style={{ marginTop: 16 }} />
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={() => onSave(audioBlob)}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<RedoIcon />}
                            onClick={onRedo}
                        >
                            Redo
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default AudioRecorder;
