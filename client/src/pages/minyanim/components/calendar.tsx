'use client';

import * as React from 'react';
import { setSettingTimes, updateSettingTimesValue } from '@/state/setting-times/setting-times-slice';
import type { RootState } from '@/state/store';
import { HDate, HebrewCalendar } from '@hebcal/core';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { DatePicker } from '@mui/x-date-pickers';
import { CheckCircle, XCircle } from '@phosphor-icons/react';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import type { LineItemTable } from '@/types/minyanim';
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

const getFormat = (value: number | string): React.JSX.Element => {
  return (
    <Typography component="span" position="relative" sx={{ ...styleTypography }} variant="inherit">
      {value}
    </Typography>
  );
};

const API_BASE_URL = import.meta.env.VITE_LOCAL_SERVER;

export function Calendar(props: {
  handlePlusClick: (index: number, location: number) => void; // Updated signature
  handleBlurInput: (value: LineItemTable[keyof LineItemTable], index: number, field: string) => void;
  selectedDate: Dayjs;
  setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  rooms: Room[];
  roomsOption: SelectOption[];
}): React.JSX.Element {
  const { handlePlusClick, handleBlurInput, selectedDate, setSelectedDate, rooms, roomsOption } = props;

  const settingTimesItem = useSelector((state: RootState) => state.settingTimes.settingTimesItem);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchMinyanim = async () => {
      try {
        // First fetch: get the default calendar minyanim
        const calendarRes = await axios.get(`${API_BASE_URL}/minyan/getCalendar/${selectedDate}`);
        const minyanim = calendarRes.data.map((minyan: any) => ({
          ...minyan,
          blink: minyan.blink?.secondsNum,
          startDate: minyan.startDate?.time,
          endDate: minyan.endDate?.time,
          isRoutine: minyan.spesificDate?.isRoutine,
        }));

        // Dispatch to Redux store
        dispatch(setSettingTimes({ setting: minyanim }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMinyanim();
  }, [dispatch, selectedDate]);
  const handleDelete = async (index: number) => {
    const minyanId = settingTimesItem[index].id;
  console.log("handleDelete");
  
    try {
      // Fetch the current minyan data
      const currentMinyanRes = await axios.get(`${API_BASE_URL}/minyan/${minyanId}`);
      const currentInactiveDates = currentMinyanRes.data.inactiveDates || [];
  
      // Add the selected date to inactiveDates
      const updatedInactiveDates = [...currentInactiveDates, selectedDate.format('YYYY-MM-DD')];
  
      // Update the minyan in the database with the new inactiveDates
      await axios.put(`${API_BASE_URL}/minyan/${minyanId}`, {
        inactiveDates: updatedInactiveDates,
      });
  
      // Update the Redux store using the existing updateSettingTimesValue action
      dispatch(updateSettingTimesValue({
        index,
        field: 'inactiveDates',
        value: updatedInactiveDates,
      }));
    } catch (err) {
      console.log('Error updating inactive dates:', err);
    }
  };
  
  

  const handleChange = (value: LineItemTable[keyof LineItemTable], index: number, field: string): void => {
    value != undefined && dispatch(updateSettingTimesValue({ index, field, value }));
  };
  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };
  const handleInputChangeConditionally = (row: LineItemTable, columnId: string, value: any) => {
    // בדוק אם dateType הוא לא 'calendar' לפני קריאה לפונקציה
    if (row.dateType !== 'calendar') {
      handleChange(row.id, columnId, value);
    }
  };
  
  const handleBlurInputConditionally = (row: LineItemTable, columnId: string, value: any) => {
    // בדוק אם dateType הוא לא 'calendar' לפני קריאה לפונקציה
    if (row.dateType !== 'calendar') {
      handleBlurInput(row.id, columnId, value);
    }
  };
  const columns  = [
    {
      formatter: (row) => getFormat(row.blink ? row.blink : ''),
      typeEditinput: 'number',
      name: 'Blink',
      width: '250px',
      field: 'blink',
      padding: 'none',
      align: 'center',
      tooltip: 'Time to start Blink before lights on',
    },
    {
      formatter: (row) => getFormat(dayjs(row.startDate).format('hh:mm')),
      typeEditinput: 'time',
      padding: 'none',
      name: 'Start Date',
      width: '250px',
      field: 'startDate',
      align: 'center',
      tooltip: 'Lights On',
      valueForEdit: (row) => dayjs(row.startDate).format('hh:mm'),
    },
    {
      formatter: (row) => getFormat(dayjs(row.endDate).format('hh:mm')),
      typeEditinput: 'time',
      padding: 'none',
      name: 'End Date',
      width: '250px',
      field: 'endDate',
      align: 'center',
      tooltip: 'Lights Off',
      valueForEdit: (row) => dayjs(row.endDate).format('hh:mm'),
    },
    {
      formatter: (row) => getFormat(row.room?.nameRoom),
      typeEditinput: 'select',
      valueForEdit: (row) => ({ label: row.room?.nameRoom, value: row.room?.id }),
      selectOptions: roomsOption,  // Assuming roomsOption is populated correctly
      valueOption: rooms,  // Assuming rooms is the list of room objects
      padding: 'none',
      name: 'Room',
      width: '250px',
      field: 'room',
      align: 'center',
    },
    {
      formatter: (row) => {
        if (row.isRoutine === undefined) return <></>;
        return row.isRoutine ? <CheckCircle size={24} /> : <XCircle size={24} />;
      },
      typeEditinput: 'switch',
      valueForEdit: (row) => row.isRoutine,
      name: 'Is Routine',
      width: '150px',
      padding: 'none',
      align: 'center',
      field: 'isRoutine',
    },
  ] satisfies ColumnDef<LineItemTable>[];
  const getRowStyle = (row: LineItemTable): React.CSSProperties => {
    return {
      backgroundColor: row.dateType=="calendar" ? 'lightgreen' : 'lightcoral', // צבע רקע לפי פרמטר
    };
  };
  
  return (
    <Box sx={{ bgcolor: 'var(--mui-palette-background-level1)', p: 3 }}>
      <DatePicker
        format="MMM D, YYYY"
        label="Specific Date"
        value={selectedDate}
        minDate={dayjs()}
        onChange={handleDateChange}
      />{' '}
      <Card>
        <Divider />
        <Box sx={{ overflowX: 'auto', position: 'relative' }}>
          <DataTable<LineItemTable>
            type="calendar"
            columns={columns}
            edited
            onAddRowClick={handlePlusClick}
            onChangeInput={handleChange}
            onBlurInput={handleBlurInput}
            onDeleteClick={handleDelete}
            rows={settingTimesItem}
            rowProps={(row) => {
              return { sx: getRowStyle(row) };
            }}
          />
          
        </Box>
      </Card>
    </Box>
  );
}
