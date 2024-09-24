import React, { useEffect } from 'react';
import { selectMessageRooms } from '@/state/message-room/message-room-slice';
import { CardActions, IconButton } from '@mui/material';
import { Plus } from '@phosphor-icons/react';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import { useSelector } from 'react-redux';

import { SystemMessages } from './systemMessages';

export function AddMessage(props: {
  roomName: string;
  isSettingPage?: boolean;
  onClick?: (messageId?: string) => void;
}): React.JSX.Element {
  const { roomName, isSettingPage, onClick } = props;
  const messages = useSelector(selectMessageRooms);
  const [displayMessages, setDisplayMessages] = React.useState<{ [key: string]: boolean }>({}); // ניהול state לפי חדר

  const filteredMessages = messages.filter((contact) => contact.name === props.roomName);

  const handleMessageClick = (roomName: string) => {
    setDisplayMessages((prevState) => ({
      ...prevState,
      [roomName]: true,
    }));
  };

  const handleCloseMessage = (roomName: string, messageId?: string) => {
    setDisplayMessages((prevState) => ({
      ...prevState,
      [roomName]: false,
    }));
    onClick && onClick(messageId);
  };

  return (
    <>
      {isSettingPage ? (
        <IconButton color="secondary" size="small" onClick={() => handleMessageClick(roomName)}>
          <Plus size={10} />
        </IconButton>
      ) : (
        <CardActions sx={{ justifyContent: 'center' }}>
          <IconButton color="secondary" size="small" onClick={() => handleMessageClick(roomName)}>
            <SpeakerIcon />
          </IconButton>
        </CardActions>
      )}
      <SystemMessages
        open={displayMessages[roomName] || false}
        handleClose={(messageId?: string) => handleCloseMessage(roomName, messageId)}
        room={roomName}
      />
    </>
  );
}
