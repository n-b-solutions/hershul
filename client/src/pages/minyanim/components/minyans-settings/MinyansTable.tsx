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
import type { RootState } from '@/redux/store';
import { getNewMinyanObj } from '@/services/minyans.service';
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

export const MinyansTable = ({
  dateType,
  scrollAction,
}: {
  dateType: eDateType;
  scrollAction?: { isScroll: boolean; setIsScroll: React.Dispatch<React.SetStateAction<boolean>> };
}): React.JSX.Element => {
  const settingTimesItem = useSelector((state: RootState) => state.minyans.settingTimesItem);
  const dispatch = useDispatch();
  const { rooms, roomsAsSelectOptions } = useSelector((state: RootState) => state.room);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await axios
        .get(`${API_BASE_URL}/minyan/getMinyanimByDateType`, {
          params: { dateType },
        })
        .then((res) => {
          dispatch(
            setSettingTimes({
              setting: res.data.map((minyan: GetNewMinyan) => {
                return {
                  ...minyan,
                  blink: { secondsNum: minyan.blink?.secondsNum, message: minyan.blink?.message },
                  startDate: { time: minyan.startDate?.time, message: minyan.startDate?.message },
                  endDate: { time: minyan.endDate?.time, message: minyan.endDate?.message },
                  isRoutine: minyan.specificDate?.isRoutine,
                  isEdited: false,
                };
              }),
            })
          );
        })
        .then(() => {
          dispatch(sortSettingTimesItem());
        })
        .catch((err) => console.log('Error fetching data:', err))
        .finally(() => {
          setLoading(false);
        });
    };

    fetchData();
  }, [dateType]);

  const handlePlusClick = async (index: number, location?: eLocationClick): Promise<any> => {
    const newRow: NewMinyan = getNewMinyanObj(settingTimesItem, dateType, rooms[0].id, index, location);
    await axios
      .post<GetNewMinyan>(`${API_BASE_URL}/minyan`, { ...newRow })
      .then(async (res) => {
        const currentRoom = rooms.find((m) => m.id === res.data.roomId);
        const { roomId: room, ...data } = res.data;
        dispatch(
          await addSettingTimes({
            newRow: {
              blink: data.blink,
              endDate: data.endDate,
              startDate: data.startDate,
              room: currentRoom!,
              dateType: data.dateType,
              inactiveDates: data.inactiveDates || [],
              id: data.id,
              isEdited: true,
            },
          })
        );
      })
      .then(async () => {
        dispatch(await sortSettingTimesItem());
      })
      .then(() => {
        setTimeout(() => {
          setFalseEdited();
          dispatch(
            updateSettingTimesValue({ index: settingTimesItem.length, field: eFieldName.isEdited, value: false })
          );
        }, 1000);
      })
      .catch((err) => console.log('Error fetching data:', err));
  };

  const setFalseEdited = () => {
    settingTimesItem.map((_, index) => {
      dispatch(updateSettingTimesValue({ index, field: eFieldName.isEdited, value: false }));
    });
  };

  const handleChange = (
    value: typeForEdit,
    index: number,
    field: keyof MinyanDetails,
    internalField?: string
  ): void => {
    value && dispatch(updateSettingTimesValue({ index, field, value, internalField }));
  };

  const handleDelete = (index: number) => {
    const minyanId = settingTimesItem[index].id;
    axios
      .delete<{ deletedMinyan: MinyanDetails }>(`${API_BASE_URL}/minyan/${minyanId}`)
      .then((res) => dispatch(deleteMinyan({ minyanId: res.data.deletedMinyan.id })))
      .catch((err) => console.log('Error fetching data:', err));
  };

  const handleBlurInput = (
    value: typeForEdit,
    index: number,
    field: keyof MinyanDetails,
    internalField?: string
  ): void => {
    const updateId = settingTimesItem[index].id;
    const fieldForEdit = field === eFieldName.room ? eFieldName.roomId : field;
    axios
      .put(`${API_BASE_URL}/minyan/${updateId}`, {
        value,
        field: fieldForEdit,
        internalField,
      })
      .then((res) => {
        const editValue = rooms?.find((value: Room) => value.id === res.data) || value;
        if (editValue) {
          dispatch(updateSettingTimesValue({ index, field, value: editValue, internalField }));
          dispatch(updateSettingTimesValue({ index, field: eFieldName.isEdited, value: true }));
          setTimeout(() => {
            setFalseEdited();
          }, 1000);
          if (field === eFieldName.endDate || field === eFieldName.startDate) dispatch(sortSettingTimesItem());
        }
      })
      .catch((err) => console.log('Error fetching data:', err));
  };

  return (
    <>
      {loading ? (
        <Typography textAlign="center" variant="h6">
          Loading...
        </Typography>
      ) : (
        <DataTable<MinyanDetails>
          columns={getMinyansSettingsColumns({ roomArray: rooms, roomsOptionsArray: roomsAsSelectOptions })}
          edited
          onAddRowClick={handlePlusClick}
          onChangeInput={handleChange}
          onBlurInput={handleBlurInput}
          onDeleteClick={handleDelete}
          rows={settingTimesItem}
          stickyHeader
          scrollAction={scrollAction}
        />
      )}
    </>
  );
};
