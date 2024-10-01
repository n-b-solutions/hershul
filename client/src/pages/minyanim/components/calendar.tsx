import * as React from 'react';
import { API_BASE_URL } from '@/consts/api';
import { eFieldName, eLocationClick } from '@/consts/setting-minyans';
import { isDateInactive } from '@/helpers/functions-times';
import {
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
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import type { LineItemTable, SpecificDate, typeForEdit } from '@/types/minyanim';
import { Room, SelectOption } from '@/types/room';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';

import { getMinyansColumns } from '../config/minyanim-columns.config';

const isRoutineColumn: ColumnDef<LineItemTable> = {
  typeEditinput: 'switch',
  valueForEdit: (row) => row.isRoutine,
  name: 'Is Routine',
  width: '150px',
  padding: 'none',
  align: 'center',
  field: 'isRoutine',
  editable: true,
};

export function Calendar(props: {
  handlePlusClick: (index: number, location?: eLocationClick) => void; // Updated signature
  selectedDate: Dayjs;
  setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  rooms: Room[];
  roomsOption: SelectOption[];
}): React.JSX.Element {
  const { handlePlusClick, selectedDate, setSelectedDate, rooms, roomsOption } = props;

  const settingTimesItem = useSelector((state: RootState) => state.settingTimes.settingTimesItem);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchMinyanim = async () => {
      try {
        // First fetch: get the default calendar minyanim
        const date = selectedDate.toDate(); // תאריך בפורמט ISO
        const calendarRes = await axios.get(`${API_BASE_URL}/minyan/getCalendar/${date}`);
        const minyanim = calendarRes.data.map((minyan: any) => {
          let isRoutine = minyan.specificDate?.isRoutine;
          if (!isRoutine && isDateInactive(selectedDate.toDate(), minyan.inactiveDates)) {
            const inactiveDate = minyan.inactiveDates.find(
              (item: any) =>
                new Date(item.date).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
            );
            isRoutine = inactiveDate?.isRoutine;
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
    console.log(settingTimesItem[index].dateType);

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
          await axios.put(`${API_BASE_URL}/minyan/removeInactiveDates/${minyanId}`, {
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
          dispatch(
            updateSettingTimesValue({
              index,
              field: 'isRoutine',
              value: undefined,
            })
          );
        } else {
          // If the date does not exist, add it
          await axios.put(`${API_BASE_URL}/minyan/addInactiveDates/${minyanId}`, {
            date: selectedDate.toDate(), // Keep it as string
            isRoutine: isRoutine || false,
          });

          const updatedInactiveDates: SpecificDate[] = [
            ...currentInactiveDates,
            { date: selectedDate.toISOString(), isRoutine: isRoutine || false }, // Keep it as string
          ];
          dispatch(
            updateSettingTimesValue({
              index,
              field: 'inactiveDates',
              value: updatedInactiveDates,
            })
          );
          dispatch(
            updateSettingTimesValue({
              index,
              field: 'isRoutine',
              value: false,
            })
          );
        }
      } catch (err) {
        console.log('Error updating inactive dates:', err);
      }
    }
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
    const isInactiveDate = isDateInactive(selectedDate.toDate(), settingTimesItem[index].inactiveDates);
    if (isInactiveDate) {
      axios.put(`${API_BASE_URL}/minyan/updateInactiveDate/${updateId}`, {
        date: selectedDate.toISOString(),
        isRoutine: value,
      });
    } else {
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
            dispatch(sortSettingTimesItem());
          }
        })
        .catch((err) => console.log('Error fetching data:', err));
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

    const rowType = isInactiveDate ? 'disable' : row.dateType === 'calendar' || !row.dateType ? 'calendar' : 'other';

    return {
      sx: {
        backgroundColor: isInactiveDate ? 'lightgray' : row.dateType !== 'calendar' && row.dateType ? 'lightgreen' : '',
      },
      type: rowType,
    };
  };

  return (
    <>
      <DatePicker
        format="MMM D, YYYY"
        label="Specific Date"
        value={selectedDate}
        minDate={dayjs()}
        onChange={handleDateChange}
      />
      <DataTable<LineItemTable>
        type="calendar"
        columns={[...getMinyansColumns({ roomArray: rooms, roomsOptionsArray: roomsOption }), isRoutineColumn]}
        edited
        onAddRowClick={handlePlusClick}
        onChangeInput={handleChange}
        onBlurInput={handleBlurInput}
        onDeleteClick={handleDelete}
        rows={settingTimesItem}
        rowProps={(row) => getRowProps(row)} // Call getRowProps for each row
      />
    </>
  );
}
