'use client';

import * as React from 'react';
import { API_BASE_URL } from '@/consts/api';
import { eLocationClick } from '@/consts/setting-minyans';
import { isDateInactive } from '@/helpers/functions-times';
import { deleteMinyan, setSettingTimes, updateSettingTimesValue } from '@/state/setting-times/setting-times-slice';
import type { RootState } from '@/state/store';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { DatePicker } from '@mui/x-date-pickers';
import { CheckCircle, XCircle } from '@phosphor-icons/react';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import type { LineItemTable, SpecificDate, typeForEdit } from '@/types/minyanim';
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

export function Calendar(props: {
  handlePlusClick: (index: number, location?: eLocationClick) => void; // Updated signature
  handleBlurInput: (value: typeForEdit, index: number, field: keyof LineItemTable) => void;
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
        const date = selectedDate.toDate(); // תאריך בפורמט ISO
        console.log("getcalendar",date);

        const calendarRes = await axios.get(`${API_BASE_URL}/minyan/getCalendar/${date}`);
        console.log(calendarRes.data);
        
        const minyanim = calendarRes.data.map((minyan: any) => {
          let isRoutine = minyan.specificDate?.isRoutine;
          if (!isRoutine && isDateInactive(selectedDate.toDate(), minyan.inactiveDates)) {
            const inactiveDate = minyan.inactiveDates.find(
              (item: any) =>
                new Date(item.date).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
            );
            isRoutine = inactiveDate?.isRoutine ?? false;
          }

          // החזרת האובייקט המעודכן
          return {
            ...minyan,
            isRoutine, // משתמשים ב-isRoutine בתוך האובייקט
          };
        });

        // Dispatch to Redux store
        dispatch(setSettingTimes({ setting: minyanim }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMinyanim();
  }, [dispatch, selectedDate]);
  const handleDelete = async (index: number) => {
    if (settingTimesItem[index].dateType === 'calendar') {
      // Deleting Minyan
      axios
        .delete<{ deletedMinyan: LineItemTable }>(`${API_BASE_URL}/minyan/${settingTimesItem[index].id}`)
        .then((res) => dispatch(deleteMinyan({ minyanId: res.data.deletedMinyan.id })))
        .catch((err) => console.log('Error fetching data:', err));
    } else {
      const minyanId = settingTimesItem[index].id;
  
      try {
        const currentMinyanRes = settingTimesItem[index];
        const currentInactiveDates = currentMinyanRes.inactiveDates || [];
        const isRoutine = currentMinyanRes.isRoutine;
        const isDateInInactive = currentInactiveDates.some((inactiveDate: any) => {
          if (!inactiveDate || !inactiveDate.date) {
            return false;
          }
          const elementDate = new Date(inactiveDate.date).toISOString().split('T')[0];
          return elementDate === selectedDate.toISOString().split('T')[0];
        });
  
        if (isDateInInactive) {
          // If the date exists, remove it
          await axios.put(`${API_BASE_URL}/minyan/updateInactiveDate/${minyanId}`, {
            data: {
              date: selectedDate.toISOString(), // Keep it as string
              isRoutine: isRoutine,
            },
          });
  
          const updatedInactiveDates = currentInactiveDates.filter((inactiveDate: any) => {
            const elementDate = new Date(inactiveDate.date).toISOString().split('T')[0];
            return elementDate !== selectedDate.toISOString().split('T')[0];
          });
  
          dispatch(
            updateSettingTimesValue({
              index,
              field: 'inactiveDates',
              value: updatedInactiveDates,
            })
          );
        } else {
          // If the date does not exist, add it
          await axios.put(`${API_BASE_URL}/minyan/addInactiveDates/${minyanId}`, {
            date: selectedDate.toDate(), // Keep it as string
            isRoutine: isRoutine,
          });
  
          const updatedInactiveDates: SpesificDate[] = [
            ...currentInactiveDates,
            { date: selectedDate.toDate(), isRoutine: isRoutine || false }, // Keep it as string
          ];
  
          dispatch(
            updateSettingTimesValue({
              index,
              field: 'inactiveDates',
              value: updatedInactiveDates,
            })
          );
        }
      } catch (err) {
        console.log('Error updating inactive dates:', err);
      }
    }
  };
  

  const handleChange = (value: typeForEdit, index: number, field: keyof LineItemTable): void => {
    value != undefined && dispatch(updateSettingTimesValue({ index, field, value }));
  };
  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };
  const getRowProps = (row: LineItemTable): { sx: React.CSSProperties; type: string } => {
    const isInactiveDate = isDateInactive(selectedDate.toDate(), row.inactiveDates);

    const rowType = isInactiveDate ? 'disable' : row.dateType === 'calendar' ? 'calendar' : 'other';

    return {
      sx: {
        backgroundColor: isInactiveDate ? 'lightgray' : row.dateType !== 'calendar' ? 'lightgreen' : '',
      },
      type: rowType,
    };
  };

  const columns = [
    {
      formatter: (row) => getFormat(row.blink?.secondsNum ? row.blink.secondsNum : ''),
      typeEditinput: 'number',
      name: 'Blink',
      width: '250px',
      field: 'blink',
      padding: 'none',
      align: 'center',
      tooltip: 'Time to start Blink before lights on',
    },
    {
      formatter: (row) => getFormat(dayjs(row.startDate.time).format('hh:mm')),
      typeEditinput: 'time',
      padding: 'none',
      name: 'Start Date',
      width: '250px',
      field: 'startDate',
      align: 'center',
      tooltip: 'Lights On',
      valueForEdit: (row) => dayjs(row.startDate.time).format('hh:mm'),
    },
    {
      formatter: (row) => getFormat(dayjs(row.endDate.time).format('hh:mm')),
      typeEditinput: 'time',
      padding: 'none',
      name: 'End Date',
      width: '250px',
      field: 'endDate',
      align: 'center',
      tooltip: 'Lights Off',
      valueForEdit: (row) => dayjs(row.endDate.time).format('hh:mm'),
    },
    {
      formatter: (row) => getFormat(row.room?.nameRoom),
      typeEditinput: 'select',
      valueForEdit: (row) => ({ label: row.room?.nameRoom, value: row.room?.id }),
      selectOptions: roomsOption, // Assuming roomsOption is populated correctly
      valueOption: rooms, // Assuming rooms is the list of room objects
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
      valueForField: (row: any) => {
        const isInactiveDate = isDateInactive(selectedDate.toDate(), row.inactiveDates);
        return isInactiveDate ? 'inactiveDates' : 'isRoutine';
      },
      name: 'Is Routine',
      width: '150px',
      padding: 'none',
      align: 'center',
      field: 'isRoutine',
      editable: true,
    },
  ] satisfies ColumnDef<LineItemTable>[];

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
            type="calendar" // כאן אנחנו משתמשים במשתנה type
            columns={columns}
            edited
            onAddRowClick={handlePlusClick}
            onChangeInput={handleChange}
            onBlurInput={handleBlurInput}
            onDeleteClick={handleDelete}
            rows={settingTimesItem}
            rowProps={(row) => getRowProps(row)} // Call getRowProps for each row
          />
        </Box>
      </Card>
    </Box>
  );
}
