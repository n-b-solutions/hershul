import { API_BASE_URL } from '@/const/api.const';
import { MESSAGE_ID } from '@/const/minyans.const';
import { updateLuachMinyanTimesValue, updateSettingTimesValue } from '@/redux/minyans/setting-times-slice';
import { AppDispatch } from '@/redux/store';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { Trash } from '@phosphor-icons/react';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import { tFieldLuachMinyanTable } from '@/types/luach-minyan.type';
import { MessageTab } from '@/types/message.type';
import { tFieldMinyanTable } from '@/types/minyans.type';
import { AddMessageButton } from '@/components/message/AddMessageButton';

import { EditedLuachType } from '../../../../../../lib/types/luach-minyan.type';
import { EditedType } from '../../../../../../lib/types/minyan.type';

export function ActionsMessage(props: {
  roomName: string;
  message?: MessageTab;
  minyanId: string;
  field: tFieldMinyanTable | tFieldLuachMinyanTable;
  index: number;
  disabledEdit: boolean;
  blockType?: 'minyan' | 'luachMinyan';
}): React.JSX.Element {
  const { roomName, message, minyanId, field, index, disabledEdit, blockType } = props;

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (messageId?: string) => {
    const endpointBody = {
      value: messageId ?? null,
      field,
      internalField: MESSAGE_ID,
    };
    const dispatchCommonPayload = {
      index,
      internalField: 'message',
    };

    if (blockType === 'luachMinyan') {
      const url = `${API_BASE_URL}/luach-minyan/${minyanId}`;
      axios
        .put<EditedLuachType>(url, endpointBody)
        .then((res) => {
          dispatch(
            updateLuachMinyanTimesValue({
              ...dispatchCommonPayload,
              field: field as tFieldLuachMinyanTable,
              value: res.data.editedValue ?? undefined,
            })
          );
        })
        .catch((err) => console.log('Error fetching data:', err));
    } else {
      const url = `${API_BASE_URL}/minyan/${minyanId}`;
      axios
        .put<EditedType>(url, endpointBody)
        .then((res) => {
          dispatch(
            updateSettingTimesValue({
              ...dispatchCommonPayload,
              field: field as tFieldMinyanTable,
              value: res.data.editedValue ?? undefined,
            })
          );
        })
        .catch((err) => console.log('Error fetching data:', err));
    }
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
            disabled={disabledEdit}
          >
            <Trash size={10} />
          </IconButton>
        ) : (
          <AddMessageButton
            roomName={roomName}
            isSettingPage={true}
            onClick={(messageId?: string) => handleClick(messageId)}
            disabledEdit={disabledEdit}
          />
        )}
      </Grid>
    </Grid>
  );
}
