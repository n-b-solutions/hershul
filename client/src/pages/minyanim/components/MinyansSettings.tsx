'use client';

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
import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { eFieldName, eLocationClick } from '@/types/enums';
import { MessageTab } from '@/types/message.type';
import type { GetNewMinyan, MinyanDetails, NewMinyan, tFieldMinyanTable, typeForEdit } from '@/types/minyans.type';
import { Room } from '@/types/room.type';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';

import { getMinyansSettingsColumns } from '../config/minyans-settings.config';
import { ActionsMessage } from './ActionsMessage';
import { SelectOption } from '@/types/metadata.type';

export const MinyansSettings = ({ dateType }: { dateType: string }): React.JSX.Element => {
  const settingTimesItem = useSelector((state: RootState) => state.minyans.settingTimesItem);
  const dispatch = useDispatch();
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [roomsOption, setRoomsOption] = React.useState<SelectOption<string>[]>([]);
  const [isScroll, setIsScroll] = React.useState<boolean>(false);
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

  React.useEffect(() => {
    axios
      .get(`${API_BASE_URL}/roomStatus`)
      .then((res) => {
        setRoomsOption(
          res.data.map((option: { nameRoom: string; id: string }) => ({ label: option.nameRoom, value: option.id }))
        );
        setRooms(res.data);
      })
      .catch((err) => console.log('Error fetching data:', err));
  }, []);

  const handlePlusClick = async (index: number, location?: eLocationClick): Promise<any> => {
    const newRow: NewMinyan = getNewMinyan(index, location);
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

  const getNewMinyan = (index: number, location?: eLocationClick) => {
    const indexBefore = location === eLocationClick.top ? index - 1 : index;
    const indexAfter = location === eLocationClick.top ? index : index + 1;
    return {
      startDate:
        index === -1
          ? new Date()
          : getMiddleTime(settingTimesItem[indexBefore]?.startDate.time, settingTimesItem[indexAfter]?.startDate.time),
      endDate:
        index === -1
          ? new Date()
          : getMiddleTime(settingTimesItem[indexBefore]?.endDate.time, settingTimesItem[indexAfter]?.endDate.time),
      roomId: rooms[0].id,
      dateType: dateType,
      steadyFlag: false,
    };
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '100%' }} onScroll={() => setIsScroll(true)}>
        {loading ? (
          <Typography textAlign="center" variant="h6">
            Loading...
          </Typography>
        ) : (
          <DataTable<MinyanDetails>
            columns={getMinyansSettingsColumns({ roomArray: rooms, roomsOptionsArray: roomsOption })}
            edited
            onAddRowClick={handlePlusClick}
            onChangeInput={handleChange}
            onBlurInput={handleBlurInput}
            onDeleteClick={handleDelete}
            rows={settingTimesItem}
            stickyHeader
            scrollAction={{ isScroll, setIsScroll }}
          />
        )}
      </Box>
    </Box>
  );
};
