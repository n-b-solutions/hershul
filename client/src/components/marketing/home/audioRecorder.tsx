import React, { useState, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { Microphone as MicrophoneIcon, Stop as StopIcon } from '@phosphor-icons/react';

const AudioRecorder: React.FC = () => {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    const audioBlob = new Blob([event.data], { type: 'audio/wav' });
                    setAudioURL(URL.createObjectURL(audioBlob));
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
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <IconButton onClick={isRecording ? stopRecording : startRecording} sx={{ mr: 2 }}>
                {isRecording ? <StopIcon size={24} color="#3f51b5" /> : <MicrophoneIcon size={24} color="#3f51b5" />}
            </IconButton>
            <Box className="waveform" sx={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 15 }).map((_, index) => (
                    <span 
                        key={index} 
                        className={`bar ${isRecording ? 'active' : ''}`} 
                        style={{
                            animationDelay: `${index * 0.1}s`,
                            height: `${20 + Math.random() * 30}px`
                        }}
                    ></span>
                ))}
            </Box>
            {audioURL && (
                <audio controls src={audioURL} style={{ marginTop: 16 }} />
            )}
            <style>
                {`
                @keyframes pulse {
                    0% { transform: scaleY(1); }
                    50% { transform: scaleY(1.5); }
                    100% { transform: scaleY(1); }
                }

                .bar {
                    width: 8px;
                    background-color: #3f51b5;
                    transform-origin: bottom;
                }

                .bar.active {
                    animation: pulse 0.5s ease-in-out infinite;
                }
                `}
            </style>
        </Box>
    );
};

export default AudioRecorder;
