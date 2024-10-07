import { API_BASE_URL } from '@/const/api.const';
import { MESSAGE_ID } from '@/const/minyans.const';
import { updateSettingTimesValue } from '@/redux/minyans/setting-times-slice';
import { AppDispatch } from '@/redux/store';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { Trash } from '@phosphor-icons/react';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { MessageTab } from '@/types/message.type';
import { tFieldMinyanTable } from '@/types/minyans.type';
import { AddMessageButton } from '@/components/message/AddMessageButton';

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
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              handleClick();
            }}
          >
            <Trash size={10} />
          </IconButton>
        ) : (
          <AddMessageButton
            roomName={roomName}
            isSettingPage={true}
            onClick={(messageId?: string) => handleClick(messageId)}
          />
        )}
      </Grid>
    </Grid>
  );
}
