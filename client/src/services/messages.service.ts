import { API_BASE_URL } from '@/const/api.const';
import { MESSAGE_ID } from '@/const/minyans.const';
import { updateSettingTimesValue } from '@/redux/minyans/setting-times-slice';
import axios from 'axios';
import { Dispatch } from 'redux';

import { tFieldMinyanTable } from '@/types/minyans.type';

import { EditedType } from '../../../lib/types/minyan.type';

export const saveMessage = async (
  dispatch: Dispatch,
  minyanId: string,
  field: tFieldMinyanTable,
  index: number,
  messageId?: string
): Promise<void> => {
  try {
    const res = await axios
      .put<EditedType>(`${API_BASE_URL}/minyan/${minyanId}`, {
        value: messageId ?? null,
        field,
        internalField: MESSAGE_ID,
      })
      .then((res) => {
        dispatch(
          updateSettingTimesValue({
            index,
            field,
            value: res.data.editedValue ?? undefined,
            internalField: 'message',
          })
        );
      });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Error fetching data:', err.response?.data || err.message);
    } else {
      console.error('Unexpected error:', err);
    }
  }
};
