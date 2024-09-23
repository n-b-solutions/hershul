'use client';

import * as React from 'react';
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
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import type { GetNewMinyan, LineItemTable, NewMinyan } from '@/types/minyanim';
import { Room, SelectOption } from '@/types/room';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';

const styleTypography = {
  display: 'grid',
  justifyItems: 'center',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  height: '54px',
};

const columns = (props: { roomArray: Room[]; roomsOptionsArray: SelectOption[] }) =>
  [
    {
      formatter: (row): React.JSX.Element => getFormat(row.blink ? row.blink : ''),
      typeEditinput: 'number',
      name: 'Blink',
      width: '250px',
      field: 'blink',
      padding: 'none',
      align: 'center',
      tooltip: 'Time to start Blink before lights on',
    },
    {
      formatter: (row): React.JSX.Element => getFormat(dayjs(row.startDate).format('hh:mm A')),
      typeEditinput: 'time',
      padding: 'none',
      name: 'Start Date',
      width: '250px',
      field: 'startDate',
      align: 'center',
      tooltip: 'Lights On',
      valueForEdit: (row) => dayjs(row.startDate),
    },
    {
      formatter: (row): React.JSX.Element => getFormat(dayjs(row.endDate).format('hh:mm A')),
      typeEditinput: 'time',
      padding: 'none',
      name: 'End Date',
      width: '250px',
      field: 'endDate',
      align: 'center',
      tooltip: 'Lights Off',
      valueForEdit: (row) => dayjs(row.endDate),
    },
    {
      formatter: (row): React.JSX.Element => getFormat(row.room?.nameRoom),
      typeEditinput: 'select',
      valueForEdit: (row) => row.room.id,
      selectOptions: props.roomsOptionsArray,
      valueOption: props.roomArray,
      padding: 'none',
      name: 'Room',
      width: '250px',
      field: 'room',
      align: 'center',
    },
  ] satisfies ColumnDef<LineItemTable>[];

const getFormat = (value: number | string): React.JSX.Element => {
  return (
    <Typography component="span" position="relative" sx={{ ...styleTypography }} variant="inherit">
      {value}
    </Typography>
  );
};

const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL + ':' + import.meta.env.VITE_SERVER_PORT;

export function ZmanimTable(props: { typeDate: string }): React.JSX.Element {
  const settingTimesItem = useSelector((state: RootState) => state.settingTimes.settingTimesItem);
  const dispatch = useDispatch();
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [roomsOption, setRoomsOption] = React.useState<SelectOption[]>([]);
  const dateType = props.typeDate;
  React.useEffect(() => {
    axios
      .get(`${API_BASE_URL}/minyan/getMinyanimByDateType`, {
        params: { dateType },
      })
      .then((res) =>
        dispatch(
          setSettingTimes({
            setting: res.data.map((minyan: any) => {
              return {
                ...minyan,
                blink: minyan.blink?.secondsNum,
                startDate: minyan.startDate?.time,
                endDate: minyan.endDate?.time,
              };
            }),
          })
        )
      )
      .then(() => dispatch(sortSettingTimesItem()))
      .catch((err) => console.log('Error fetching data:', err));
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

  const handlePlusClick = async (index: number, location: eLocationClick): Promise<any> => {
    const newRow: NewMinyan = getNewMinyan(index, location);
    await axios
      .post<GetNewMinyan>(`${API_BASE_URL}/minyan`, { ...newRow })
      .then((res) => {
        const currentRoom = rooms.find((m) => m.id === res.data.roomId);
        const { roomId: room, ...data } = res.data;
        dispatch(
          addSettingTimes({
            newRow: {
              blink: data.blink?.secondsNum,
              endDate: data.endDate?.time,
              startDate: data.startDate?.time,
              room: currentRoom!,
              id: data.id,
            },
          })
        );
      })
      .then(() => dispatch(sortSettingTimesItem()))
      .catch((err) => console.log('Error fetching data:', err));
  };

  const getNewMinyan = (index: number, location: eLocationClick) => {
    const indexBefore = location === eLocationClick.top ? index - 1 : index;
    const indexAfter = location === eLocationClick.top ? index : index + 1;
    return {
      startDate: getMiddleTime(settingTimesItem[indexBefore]?.startDate, settingTimesItem[indexAfter]?.startDate),
      endDate: getMiddleTime(settingTimesItem[indexBefore]?.endDate, settingTimesItem[indexAfter]?.endDate),
      roomId: rooms[0].id,
      dateType: dateType,
      steadyFlag: false,
    };
  };

  const handleChange = (value: LineItemTable[keyof LineItemTable], index: number, field: string): void => {
    value && dispatch(updateSettingTimesValue({ index, field, value }));
  };

  const handleDelete = (index: number) => {
    const minyanId = settingTimesItem[index].id;
    axios
      .delete<{ deletedMinyan: LineItemTable }>(`${API_BASE_URL}/minyan/${minyanId}`)
      .then((res) => dispatch(deleteMinyan({ minyanId: res.data.deletedMinyan.id })))
      .catch((err) => console.log('Error fetching data:', err));
  };

  const handleBlurInput = (value: LineItemTable[keyof LineItemTable], index: number, field: string): void => {
    const updateId = settingTimesItem[index].id;
    const fieldForEdit =
      field === eFieldName.room
        ? eFieldName.roomId
        : field === eFieldName.endDate
          ? eFieldName.endDateTime
          : field === eFieldName.startDate
            ? eFieldName.startDateTime
            : field === eFieldName.blink
              ? eFieldName.blinkSecondsNum
              : field;
    axios
      .put(`${API_BASE_URL}/minyan/${updateId}`, {
        value: value,
        fieldForEdit: fieldForEdit,
      })
      .then((res) => {
        const editValue = rooms?.find((value: Room) => value.id === res.data) || value;
        if (editValue) {
          dispatch(updateSettingTimesValue({ index, field, value: editValue }));
          dispatch(sortSettingTimesItem());
        }
      })
      .catch((err) => console.log('Error fetching data:', err));
  };

  return (
    <Box sx={{ bgcolor: 'var(--mui-palette-background-level1)', p: 3 }}>
      <Card>
        <Divider />
        <Box sx={{ overflowX: 'auto', position: 'relative' }}>
          <DataTable<LineItemTable>
            columns={columns({ roomArray: rooms, roomsOptionsArray: roomsOption })}
            edited
            onAddRowClick={handlePlusClick}
            onChangeInput={handleChange}
            onBlurInput={handleBlurInput}
            onDeleteClick={handleDelete}
            rows={settingTimesItem}
          />
        </Box>
      </Card>
    </Box>
  );
}
