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
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { MessageTab } from '@/types/message';
import type { GetNewMinyan, LineItemTable, NewMinyan, tFieldMinyanTable, typeForEdit } from '@/types/minyanim';
import { Room, SelectOption } from '@/types/room';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';

import { ActionsMessage } from './actions-message';

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
          roomName: row.room?.nameRoom,
          message: row.blink?.message,
          id: row?.id,
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
          value: dayjs(row.startDate?.time).format('hh:mm A'),
          roomName: row.room?.nameRoom,
          message: row.startDate?.message,
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
      valueForEdit: (row) => dayjs(row.startDate?.time),
    },
    {
      formatter: (row, index): React.JSX.Element =>
        getFormat({
          value: dayjs(row.endDate?.time).format('hh:mm A'),
          roomName: row.room?.nameRoom,
          message: row.endDate?.message,
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
      valueForEdit: (row) => dayjs(row.endDate?.time),
    },
    {
      formatter: (row): React.JSX.Element => getFormat({ value: row.room?.nameRoom }),
      typeEditinput: 'select',
      valueForEdit: (row) => row.room?.id,
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
  const settingTimesItem = useSelector((state: RootState) => state.settingTimes.settingTimesItem);
  const dispatch = useDispatch();
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [roomsOption, setRoomsOption] = React.useState<SelectOption[]>([]);
  const [isScroll, setIsScroll] = React.useState<boolean>(false);
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
                isEdited: false,
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
        }, 1000);
      })
      .catch((err) => console.log('Error fetching data:', err));
  };

  const setFalseEdited = () => {
    settingTimesItem.map((_, index) => {
      dispatch(updateSettingTimesValue({ index, field: eFieldName.isEdited, value: false }));
    });
    dispatch(updateSettingTimesValue({ index: settingTimesItem.length, field: eFieldName.isEdited, value: false }));
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
    value: typeForEdit,
    index: number,
    field: keyof LineItemTable,
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
        {' '}
        {/* הגדרה של גובה מקסימלי */}
        <DataTable<LineItemTable>
          columns={columns({ roomArray: rooms, roomsOptionsArray: roomsOption })}
          edited
          onAddRowClick={handlePlusClick}
          onChangeInput={handleChange}
          onBlurInput={handleBlurInput}
          onDeleteClick={handleDelete}
          rows={settingTimesItem}
          stickyHeader
          scrollAction={{ isScroll, setIsScroll }}
        />
      </Box>
    </Box>
  );
}
