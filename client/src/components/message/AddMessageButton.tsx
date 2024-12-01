import React from 'react';
import { messages } from '@/redux/message/messageSlice';
import { playAudio } from '@/services/play-audio.service';
import { CardActions, IconButton } from '@mui/material';
import { Plus } from '@phosphor-icons/react';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import { useSelector } from 'react-redux';

import { MessagesPopup } from './MessagesPopup';

export function AddMessageButton(props: {
  roomName: string;
  isSettingPage?: boolean;
  onClick?: (messageId?: string) => void;
  disabledEdit?: boolean;
  playAudioOnClose?: boolean;
}): React.JSX.Element {
  const { roomName, isSettingPage, onClick, disabledEdit, playAudioOnClose } = props;
  const messagesSlice = useSelector(messages);
  const [displayMessages, setDisplayMessages] = React.useState<{ [key: string]: boolean }>({});

  const handleMessageClick = (roomName: string) => {
    setDisplayMessages((prevState) => ({
      ...prevState,
      [roomName]: true,
    }));
  };

  const handleCloseMessage = async (roomName: string, messageId?: string, audioUrl?: string) => {
    setDisplayMessages((prevState) => ({
      ...prevState,
      [roomName]: false,
    }));
    onClick && onClick(messageId);

    if (playAudioOnClose && messageId) {
      if (audioUrl) {
        await playAudio(audioUrl);
      } else {
        const message = messagesSlice.find((msg) => msg.id === messageId);
        if (message && message.audioUrl) {
          await playAudio(message.audioUrl);
        }
      }
    }
  };

  return (
    <>
      {isSettingPage ? (
        <IconButton
          color="secondary"
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            handleMessageClick(roomName);
          }}
          disabled={disabledEdit}
        >
          <Plus size={10} />
        </IconButton>
      ) : (
        <CardActions sx={{ justifyContent: 'center' }}>
          <IconButton color="secondary" size="small" onClick={() => handleMessageClick(roomName)}>
            <SpeakerIcon />
          </IconButton>
        </CardActions>
      )}
      <MessagesPopup
        open={displayMessages[roomName] || false}
        handleClose={(messageId?: string, audioUrl?: string) => handleCloseMessage(roomName, messageId, audioUrl)}
        room={roomName}
      />
    </>
  );
}
