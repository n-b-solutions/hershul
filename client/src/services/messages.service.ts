import axios from 'axios';

import { Dispatch } from 'redux';
import { EditedType } from '../../../lib/types/minyan.type';
import { API_BASE_URL } from '@/const/api.const';
import { updateSettingTimesValue } from '@/redux/minyans/setting-times-slice';
import { tFieldMinyanTable } from '@/types/minyans.type';
import { useAppDispatch } from '@/redux/store';
import { MESSAGE_ID } from '@/const/minyans.const';


export const saveMessage = async (messageId: string, minyanId: string,field: tFieldMinyanTable,
    index: number, ): Promise<void> => {
        
  try {
    const res = await axios.put<EditedType>(`${API_BASE_URL}/minyan/${minyanId}`, {
      value: messageId ?? null,
      field,
      internalField: MESSAGE_ID,
    });
    const dispatch = useAppDispatch();

    dispatch(
      updateSettingTimesValue({
        index,
        field,
        value: res.data.editedValue ?? undefined,
        internalField: 'message',
      })
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Error fetching data:', err.response?.data || err.message);
    } else {
      console.error('Unexpected error:', err);
    }
  }
};