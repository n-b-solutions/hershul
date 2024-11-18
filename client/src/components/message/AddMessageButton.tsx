import React, { useEffect } from 'react';
import { messages } from '@/redux/message/messageSlice';
import { CardActions, IconButton } from '@mui/material';
import { Plus } from '@phosphor-icons/react';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import { useSelector } from 'react-redux';
import { tFieldMinyanTable } from '@/types/minyans.type';

import { MessagesPopup } from './MessagesPopup';

export function AddMessageButton(props: {
  roomName: string;
  isSettingPage?: boolean;
  onClick?: (messageId?: string) => void;
  disabledEdit?: boolean;
  fieldName: tFieldMinyanTable;
}): React.JSX.Element {
  const { roomName, isSettingPage, onClick, disabledEdit, fieldName } = props;
  const messagesSlice = useSelector(messages);
  const [displayMessages, setDisplayMessages] = React.useState<{ [key: string]: boolean }>({});

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
        handleClose={(messageId?: string) => handleCloseMessage(roomName, messageId)}
        room={roomName}
        fieldName={fieldName}
      />
    </>
  );
}
