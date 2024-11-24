import React, { useEffect } from 'react';
import { selectPopupState, setPopupOpen } from '@/redux/message/messageSlice';
import { CardActions, IconButton } from '@mui/material';
import { Plus } from '@phosphor-icons/react';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import { useDispatch, useSelector } from 'react-redux';

import { MessagesPopup } from './MessagesPopup';

export function AddMessageButton(props: {
  roomName: string;
  isSettingPage?: boolean;
  onClick?: (messageId?: string) => void;
  disabledEdit?: boolean;
  openPopup: () => void;
}): React.JSX.Element {
  const { roomName, isSettingPage, onClick, disabledEdit, openPopup } = props;
  const dispatch = useDispatch();

  const handleMessageClick = () => {
    openPopup();
  };

  return (
    <>
      {isSettingPage ? (
        <IconButton
          color="secondary"
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            handleMessageClick();
          }}
          disabled={disabledEdit}
        >
          <Plus size={10} />
        </IconButton>
      ) : (
        <CardActions sx={{ justifyContent: 'center' }}>
          <IconButton color="secondary" size="small" onClick={() => handleMessageClick()}>
            <SpeakerIcon />
          </IconButton>
        </CardActions>
      )}
    </>
  );
}
