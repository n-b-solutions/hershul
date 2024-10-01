import * as React from 'react';
import { API_BASE_URL } from '@/consts/api';
import { eFieldName, eLocationClick } from '@/consts/setting-minyans';
import { getMiddleTime } from '@/helpers/functions-times';
import {
  addSettingTimes,
  deleteMinyan,
  setSettingTimes,
  sortSettingTimesItem,
  updateSettingTimesValue,
} from '@/state/setting-times/setting-times-slice';
import type { RootState } from '@/state/store';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import type { GetNewMinyan, LineItemTable, NewMinyan, typeForEdit } from '@/types/minyanim';
import { Room, SelectOption } from '@/types/room';
import { DataTable } from '@/components/core/data-table';

import { getMinyansColumns } from '../config/minyanim-columns.config';
import { Calendar } from './calendar';
import { eDateType } from '../../../../../bin/types/minyan.type';

export function SettingMinyansTable({ dateType }: { dateType: string }): React.JSX.Element {
  const settingTimesItem = useSelector((state: RootState) => state.settingTimes.settingTimesItem);
  const dispatch = useDispatch();
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [roomsOption, setRoomsOption] = React.useState<SelectOption[]>([]);
  const [isScroll, setIsScroll] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs());

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

  const handlePlusClick = async (index: number, location?: eLocationClick, isCalendar = false): Promise<any> => {
    const newRow: NewMinyan = getNewMinyan(index, location, isCalendar);

    try {
      await axios
        .post<GetNewMinyan>(`${API_BASE_URL}/minyan`, { ...newRow })
        .then((res) => {
          const currentRoom = rooms.find((m) => m.id === res.data.roomId);
          const { roomId: room, ...data } = res.data;
          // Prepare the newRow object with or without specificDate based on isCalendar
          const dispatchData: any = {
            blink: data.blink,
            endDate: data.endDate,
            startDate: data.startDate,
            room: currentRoom!,
            id: data.id,
            isEdited: true,
            dateType: data.dateType,
          };

          if (isCalendar) {
            dispatchData.specificDate = {
              date: selectedDate.toISOString(), // Convert to ISO string
              isRoutine: false,
            };
            dispatchData.isRoutine = false;
          }
          dispatch(
            addSettingTimes({
              newRow: dispatchData,
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
        });
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  };

  const setFalseEdited = () => {
    settingTimesItem.map((_, index) => {
      dispatch(updateSettingTimesValue({ index, field: eFieldName.isEdited, value: false }));
    });
  };

  const getNewMinyan = (index: number, location?: eLocationClick, isCalendar = false) => {
    const indexBefore = location === eLocationClick.top ? index - 1 : index;
    const indexAfter = location === eLocationClick.top ? index : index + 1;
    const newMinyan: NewMinyan = {
      startDate:
        index === -1
          ? new Date()
          : getMiddleTime(settingTimesItem[indexBefore]?.startDate.time, settingTimesItem[indexAfter]?.startDate.time),
      endDate:
        index === -1
          ? new Date()
          : getMiddleTime(settingTimesItem[indexBefore]?.endDate.time, settingTimesItem[indexAfter]?.endDate.time),
      roomId: rooms[0].id,
      dateType,
      steadyFlag: false,
    };

    // Add specificDate if isCalendar is true
    if (isCalendar) {
      newMinyan.specificDate = {
        date: selectedDate.toDate(),
        isRoutine: false,
      };
    }
    return newMinyan;
  };

  const handleChange = (
    value: typeForEdit,
    index: number,
    field: keyof LineItemTable,
    internalField?: string
  ): void => {
    value && dispatch(updateSettingTimesValue({ index, field, value, internalField }));
  };

  const handleDelete = (index: number) => {
    const minyanId = settingTimesItem[index].id;
    axios
      .delete<{ deletedMinyan: LineItemTable }>(`${API_BASE_URL}/minyan/${minyanId}`)
      .then((res) => dispatch(deleteMinyan({ minyanId: res.data.deletedMinyan.id })))
      .catch((err) => console.log('Error fetching data:', err));
  };

  const handleBlurInput = (
    value: typeForEdit, // Align this to the expected type
    index: number,
    field: keyof LineItemTable,
    internalField?: string
  ): void => {
    const updateId = settingTimesItem[index].id;
    const fieldForEditDB = field === eFieldName.room ? eFieldName.roomId : field;
    // Synchronous dispatch update
    dispatch(updateSettingTimesValue({ index, field, value, internalField }));
    // Async API call can be handled here, but avoid returning Promise<void>
    axios
      .put(`${API_BASE_URL}/minyan/${updateId}`, {
        value,
        field: fieldForEditDB,
        internalField,
      })
      .then((res) => {
        const editValue = rooms?.find((room) => room.id === res.data) || value;
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
        {dateType === eDateType.CALENDAR ? (
          <Calendar
            handlePlusClick={(index: number, location?: eLocationClick) => handlePlusClick(index, location, true)} // כאן אנו מוודאים ש-isCalendar נשלח כ-TRUE
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            rooms={rooms}
            roomsOption={roomsOption}
          />
        ) : (
          <>
            {loading ? (
              <Typography textAlign="center" variant="h6">
                Loading...
              </Typography>
            ) : (
              <DataTable<LineItemTable>
                columns={getMinyansColumns({ roomArray: rooms, roomsOptionsArray: roomsOption })}
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
          </>
        )}
      </Box>
    </Box>
  );
}
