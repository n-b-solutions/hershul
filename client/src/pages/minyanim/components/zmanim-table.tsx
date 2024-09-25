'use client';

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
import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { MessageTab } from '@/types/message';
import type { GetNewMinyan, LineItemTable, NewMinyan, tFieldMinyanTable, typeForEdit } from '@/types/minyanim';
import { Room, SelectOption } from '@/types/room';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';

import { ActionsMessage } from './actions-message';
import { Calendar } from './calendar';

const styleTypography = {
  display: 'grid',
  justifyItems: 'center',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  height: '54px',
};

const columns = ({ roomArray, roomsOptionsArray }: { roomArray: Room[]; roomsOptionsArray: SelectOption[] }) =>
  [
    {
      formatter: (row, index): React.JSX.Element =>
        getFormat({
          value: row.blink?.secondsNum || '',
          roomName: row.room.nameRoom,
          message: row.blink?.message,
          id: row.id,
          field: 'blink',
          index,
        }),
      valueForEdit: (row) => row.blink?.secondsNum,
      typeEditinput: 'number',
      name: 'Blink',
      width: '250px',
      field: 'blink',
      padding: 'none',
      align: 'center',
      tooltip: 'Time to start Blink before lights on',
    },
    {
      formatter: (row, index): React.JSX.Element =>
        getFormat({
          value: dayjs(row.startDate.time).format('hh:mm A'),
          roomName: row.room.nameRoom,
          message: row.startDate.message,
          id: row.id,
          field: 'startDate',
          index,
        }),
      typeEditinput: 'time',
      padding: 'none',
      name: 'Start Time',
      width: '250px',
      field: 'startDate',
      align: 'center',
      tooltip: 'Lights On',
      valueForEdit: (row) => dayjs(row.startDate.time),
    },
    {
      formatter: (row, index): React.JSX.Element =>
        getFormat({
          value: dayjs(row.endDate.time).format('hh:mm A'),
          roomName: row.room.nameRoom,
          message: row.endDate.message,
          id: row.id,
          field: 'endDate',
          index: index,
        }),
      typeEditinput: 'time',
      padding: 'none',
      name: 'End Time',
      width: '250px',
      field: 'endDate',
      align: 'center',
      tooltip: 'Lights Off',
      valueForEdit: (row) => dayjs(row.endDate.time),
    },
    {
      formatter: (row): React.JSX.Element => getFormat({ value: row.room?.nameRoom }),
      typeEditinput: 'select',
      valueForEdit: (row) => row.room.id,
      selectOptions: roomsOptionsArray,
      valueOption: roomArray,
      padding: 'none',
      name: 'Room',
      width: '250px',
      field: 'room',
      align: 'center',
    },
  ] satisfies ColumnDef<LineItemTable>[];

const getFormat = (props: {
  value: number | string;
  roomName?: string;
  message?: MessageTab;
  id?: string;
  field?: tFieldMinyanTable;
  index?: number;
}): React.JSX.Element => {
  return (
    <Grid container direction="row" justifyContent="center" spacing={2}>
      <Grid item>
        <Typography component="span" position="relative" sx={{ ...styleTypography }} variant="inherit">
          {props.value}
        </Typography>
      </Grid>
      {props.value && (
        <Grid item>
          {props.roomName && props.id && props.field && (
            <ActionsMessage
              field={props.field}
              roomName={props.roomName}
              message={props.message}
              minyanId={props.id}
              index={props?.index ?? 0}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
};

export function ZmanimTable(props: { typeDate: string }): React.JSX.Element {
  const { typeDate } = props;

  const settingTimesItem = useSelector((state: RootState) => state.settingTimes.settingTimesItem);
  const dispatch = useDispatch();
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [roomsOption, setRoomsOption] = React.useState<SelectOption[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs());
  const dateType = props.typeDate;
  React.useEffect(() => {
    axios
      .get(`${API_BASE_URL}/minyan/getMinyanimByDateType`, {
        params: { dateType },
      })
      .then((res) =>
        dispatch(
          setSettingTimes({
            setting: res.data.map((minyan: GetNewMinyan) => {
              return {
                ...minyan,
                blink: { secondsNum: minyan.blink?.secondsNum, message: minyan.blink?.message },
                startDate: { time: minyan.startDate?.time, message: minyan.startDate?.message },
                endDate: { time: minyan.endDate?.time, message: minyan.endDate?.message },
                isRoutine: minyan.spesificDate?.isRoutine,
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

  const handlePlusClick = async (index: number, location?: eLocationClick, isCalendar = false): Promise<any> => {
    const newRow: NewMinyan = getNewMinyan(index, location, isCalendar);

    try {
      const res = await axios.post<GetNewMinyan>(`${API_BASE_URL}/minyan`, { ...newRow });
      const currentRoom = rooms.find((m) => m.id === res.data.roomId);
      const { roomId: room, ...data } = res.data;

      // Prepare the newRow object with or without spesificDate based on isCalendar
      const dispatchData: any = {
        blink: data.blink,
        endDate: data.endDate,
        startDate: data.startDate,
        room: currentRoom!,
        id: data.id,
      };

      if (isCalendar) {
        dispatchData.spesificDate = {
          date: selectedDate.toISOString(), // Convert to ISO string
          isRoutine: false,
        };
      }
      dispatch(
        addSettingTimes({
          newRow: dispatchData,
        })
      );
      dispatch(sortSettingTimesItem());
    } catch (err) {
      console.log('Error fetching data:', err);
    }
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
      dateType: dateType,
      steadyFlag: false,
    };

    // Add spesificDate if isCalendar is true
    if (isCalendar) {
      newMinyan.spesificDate = {
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
    value: typeForEdit,  // Align this to the expected type
    index: number,
    field: keyof LineItemTable,
    internalField?: string
  ): void => {
    const updateId = settingTimesItem[index].id;
  
    // Depending on the field, you may need to handle async API calls inside the function synchronously
    const fieldForEdit = mapFieldForEdit(field); // Helper function to map the fields
  
    // Synchronous dispatch update
    dispatch(updateSettingTimesValue({ index, field, value, internalField }));
  
    // Async API call can be handled here, but avoid returning Promise<void>
    axios.put(`${API_BASE_URL}/minyan/${updateId}`, {
      value,
      field: fieldForEdit,
      internalField,
    }).then((res) => {
      const editValue = rooms?.find((room) => room.id === res.data) || value;
      if (editValue) {
        dispatch(updateSettingTimesValue({ index, field, value: editValue, internalField }));
        dispatch(sortSettingTimesItem());
      }
    }).catch((err) => console.log('Error fetching data:', err));
  };
  
  // Helper function to map fields
  const mapFieldForEdit = (field: keyof LineItemTable): string => {
    switch (field) {
      case 'room':
        return 'roomId';
      case 'endDate':
        return 'endDateTime';
      case 'startDate':
        return 'startDateTime';
      case 'blink':
        return 'blinkSecondsNum';
      case 'spesificDate':
        return 'isRoutine';
      default:
        return field as string;
    }
  };
  

  return (
    <Box sx={{ height: '100%', bgcolor: 'var(--mui-palette-background-level1)', p: 3 }}>
      {typeDate === 'calendar' ? (
        <Calendar
          handlePlusClick={(index: number, location?: eLocationClick) => handlePlusClick(index, location, true)} // כאן אנו מוודאים ש-isCalendar נשלח כ-TRUE
          handleBlurInput={handleBlurInput}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          rooms={rooms}
          roomsOption={roomsOption}
        />
      ) : (
        <Card sx={{ height: '100%' }}>
          <Divider />
          <Box sx={{ maxHeight: '100%', overflowX: 'auto', position: 'relative' }}>
            <DataTable<LineItemTable>
              columns={columns({ roomArray: rooms, roomsOptionsArray: roomsOption })}
              edited
              onAddRowClick={handlePlusClick}
              onChangeInput={handleChange}
              onBlurInput={handleBlurInput}
              onDeleteClick={handleDelete}
              rows={settingTimesItem}
              stickyHeader
            />
          </Box>
        </Card>
      )}
    </Box>
  );
}
