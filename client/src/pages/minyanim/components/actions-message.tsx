import { API_BASE_URL } from '@/consts/api';
import { MESSAGE_ID } from '@/consts/setting-minyans';
import { updateSettingTimesValue } from '@/state/setting-times/setting-times-slice';
import { AppDispatch } from '@/state/store';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { Trash } from '@phosphor-icons/react';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { MessageTab } from '@/types/message';
import { tFieldMinyanTable } from '@/types/minyanim';
import { AddMessage } from '@/components/marketing/home/add-message';

export function ActionsMessage(props: {
  roomName: string;
  message?: MessageTab;
  minyanId: string;
  field: tFieldMinyanTable;
  index: number;
}): React.JSX.Element {
  const { roomName, message, minyanId, field, index } = props;

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (messageId?: string) => {
    axios
      .put(`${API_BASE_URL}/minyan/${minyanId}`, {
        value: messageId ?? null,
        field,
        internalField: MESSAGE_ID,
      })
      .then((res) => {
        dispatch(
          updateSettingTimesValue({
            index,
            field,
            value: res.data ?? undefined,
            internalField: 'message',
          })
        );
      })
      .catch((err) => console.log('Error fetching data:', err));
  };

  return (
    <Grid container>
      <Grid item sx={{ display: 'grid', alignItems: 'center' }}>
        {message?.name ? (
          <Tooltip arrow title={message?.name}>
            <SpeakerIcon size={15} />
          </Tooltip>
        ) : (
          <SpeakerIcon color="var(--mui-palette-action-disabled)" size={15} />
        )}
      </Grid>
      <Grid item>
        {message?.name ? (
          <IconButton size="small" onClick={() => handleClick()}>
            <Trash size={10} />
          </IconButton>
        ) : (
          <AddMessage
            roomName={roomName}
            isSettingPage={true}
            onClick={(messageId?: string) => handleClick(messageId)}
          />
        )}
      </Grid>
    </Grid>
  );
}
