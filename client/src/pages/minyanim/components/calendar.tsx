'use client';

import * as React from 'react';
import {
  addSettingTimes,
  deleteMinyan,
  setSettingTimes,
  updateSettingTimesValue,
} from '@/state/setting-times/setting-times-slice';
import type { RootState } from '@/state/store';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import type { LineItemTable, NewMinyan } from '@/types/minyanim';
import { Room, SelectOption } from '@/types/room';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';
import Switch from '@mui/material/Switch';
import { CheckCircle } from '@phosphor-icons/react';

const styleTypography = {
  display: 'grid',
  justifyItems: 'center',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  height: '54px',
};

const getFormat = (value: number | string): React.JSX.Element => {
  return (
    <Typography component="span" position="relative" sx={{ ...styleTypography }} variant="inherit">
      {value}
    </Typography>
  );
};

const API_BASE_URL = import.meta.env.VITE_LOCAL_SERVER;

export function Calendar(): React.JSX.Element {
  const settingTimesItem = useSelector((state: RootState) => state.settingTimes.settingTimesItem);
  const dispatch = useDispatch();
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [roomsOption, setRoomsOption] = React.useState<SelectOption[]>([]);
  React.useEffect(() => {
    axios
      .get(`${API_BASE_URL}/minyan/getMinyanimByDateType/calendar`)
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
      .catch((err) => console.log('Error fetching data:', err));
  }, ['calendar']);

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

  const handlePlusClick = async (index: number): Promise<any> => {
    console.log(index);
    const newRow: NewMinyan = getNewMinyan(index);
    await axios.post<NewMinyan>(`${API_BASE_URL}/minyan`, { ...newRow }).then((res) => {
      const currentRoom = rooms.find((m) => m.id === res.data.roomId);
      const { roomId: room, ...data } = res.data;
      dispatch(
        addSettingTimes({
          index,
          newRow: {
            ...data,
            endDate: dayjs(data.endDate).format('hh:mm'),
            startDate: dayjs(data.startDate).format('hh:mm'),
            room: currentRoom!,
            id: '',
          },
        })
      );
    });
  };

  const getNewMinyan = (index: number) => {
    return {
      startDate: getBetweenTime(
        dayjs(settingTimesItem[index - 1].startDate, 'hh:mm'),
        dayjs(settingTimesItem[index].startDate, 'hh:mm')
      ),
      endDate: getBetweenTime(
        dayjs(settingTimesItem[index - 1].endDate, 'hh:mm'),
        dayjs(settingTimesItem[index].endDate, 'hh:mm')
      ),
      roomId: rooms[0].id,
      dateType: 'calendar',
      announcement: true,
      messages: 'room',
      steadyFlag: false,
    };
  };

  const getBetweenTime = (beforeTime: Dayjs, aftertime: Dayjs): Date => {
    const diff = dayjs(aftertime.diff(beforeTime));
    let betweenH = diff.get('hour') / 2;
    let betweenM = diff.get('minute') / 2;
    beforeTime.add(betweenH, 'hour');
    beforeTime.add(betweenM, 'minute');
    return dayjs(betweenH).toDate();
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
    axios
      .put(`${API_BASE_URL}/minyan/${updateId}`, {
        value: value,
        fieldForEdit: field === 'room' ? 'roomId' : field,
      })
      .then((res) => {
        const value = rooms?.find((value: Room) => value.id === res.data);
        if (value) dispatch(updateSettingTimesValue({ index, field, value }));
      })
      .catch((err) => console.log('Error fetching data:', err));
  };

  const columns = [
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
      formatter: (row): React.JSX.Element => getFormat(row.startDate),
      typeEditinput: 'time',
      padding: 'none',
      name: 'Start Date',
      width: '250px',
      field: 'startDate',
      align: 'center',
      tooltip: 'Lights On',
    },
    {
      formatter: (row): React.JSX.Element => getFormat(row.endDate),
      typeEditinput: 'time',
      padding: 'none',
      name: 'End Date',
      width: '250px',
      field: 'endDate',
      align: 'center',
      tooltip: 'Lights Off',
    },
    {
      formatter: (row): React.JSX.Element => getFormat(row.room?.nameRoom),
      typeEditinput: 'select',
      valueForEdit: (row) => ({ label: row.room.nameRoom, value: row.room.id }),
      selectOptions: roomsOption,
      valueOption: rooms,
      padding: 'none',
      name: 'Room',
      width: '250px',
      field: 'room',
      align: 'center',
    },
    {
        formatter: (row, isEditing): React.JSX.Element => (
          isEditing ? (
            <Switch />
          ) : (
            <CheckCircle size={24} weight="bold" />
        )
        ),
        typeEditinput: 'button',
        name: 'Is Routine',
        width: '150px',
        padding: 'none',
        align: 'center',
      },
  ] satisfies ColumnDef<LineItemTable>[];

  return (
    <Box sx={{ bgcolor: 'var(--mui-palette-background-level1)', p: 3 }}>
      <DatePicker format="MMM D, YYYY" label="spesifcDate" value={dayjs()} minDate={dayjs()} />
      <Card>
        <Divider />
        <Box sx={{ overflowX: 'auto', position: 'relative' }}>
          <DataTable<LineItemTable>
            columns={columns}
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