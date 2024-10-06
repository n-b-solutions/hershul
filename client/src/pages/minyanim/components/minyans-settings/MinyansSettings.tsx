import * as React from 'react';
import { API_BASE_URL } from '@/const/api.const';
import { getMiddleTime } from '@/helpers/time.helper';
import {
  addSettingTimes,
  deleteMinyan,
  setSettingTimes,
  sortSettingTimesItem,
  updateSettingTimesValue,
} from '@/redux/minyans/setting-times-slice';
import { fetchRooms } from '@/redux/room/room-slice';
import { AppDispatch, type RootState } from '@/redux/store';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { eFieldName, eLocationClick } from '@/types/enums';
import { SelectOption } from '@/types/metadata.type';
import type { GetNewMinyan, MinyanDetails, NewMinyan, typeForEdit } from '@/types/minyans.type';
import { Room } from '@/types/room.type';
import { DataTable } from '@/components/core/data-table';

import { eDateType } from '../../../../../../lib/types/minyan.type';
import { getMinyansSettingsColumns } from '../../config/minyans-settings.config';
import { Calendar } from './Calendar';
import { MinyansTable } from './MinyansTable';

export const MinyansSettings = ({ dateType }: { dateType: eDateType }): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const [isScroll, setIsScroll] = React.useState<boolean>(false);

  React.useEffect(() => {
    const getRooms = async () => await dispatch(fetchRooms());
    getRooms();
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '100%' }} onScroll={() => setIsScroll(true)}>
        {dateType === eDateType.calendar ? (
          <Calendar scrollAction={{ isScroll, setIsScroll }} />
        ) : (
          <MinyansTable dateType={dateType} scrollAction={{ isScroll, setIsScroll }} />
        )}
      </Box>
    </Box>
  );
};
