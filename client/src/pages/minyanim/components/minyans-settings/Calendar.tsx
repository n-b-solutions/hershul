import * as React from 'react';
import { API_BASE_URL } from '@/const/api.const';
import { isMinyanInactiveForSelectedDate } from '@/helpers/time.helper';
import {
  addSettingTimes,
  deleteMinyan,
  setSettingTimes,
  sortSettingTimesItem,
  updateSettingTimesValue,
} from '@/redux/minyans/setting-times-slice';
import { RootState } from '@/redux/store';
import { getNewMinyanObj } from '@/services/minyans.service';
import { HDate } from '@hebcal/core';
import { TextField, TextFieldProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowArcLeft, CheckCircle, XCircle } from '@phosphor-icons/react';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { eFieldName, eLocationClick, eRowEditMode } from '@/types/enums';
import type { MinyanApi, MinyanDetails, NewMinyan, SpecificDate, typeForEdit } from '@/types/minyans.type';
import { Room } from '@/types/room.type';
import { ColumnDef, RowProps } from '@/types/table.type';
import { DataTable } from '@/components/core/DataTable';
import JewishDatePicker from '@/components/core/jewish-datepicker';

import { eDateType } from '../../../../../../lib/types/minyan.type';
import { getMinyansSettingsColumns } from '../../config/minyans-settings.config';

const isRoutineColumn: ColumnDef<MinyanDetails> = {
  editInputType: 'switch',
  valueForEdit: (row) => row.isRoutine,
  name: 'Is Routine',
  width: '8px',
  padding: 'normal',
  align: 'center',
  field: 'isRoutine',
  editable: true,
  formatter: (row) => {
    if (row.isRoutine === undefined) return <></>;
    return row.isRoutine ? <CheckCircle size={24} /> : <XCircle size={24} />;
  },
};

export function Calendar({
  scrollAction,
}: {
  scrollAction?: { isScroll: boolean; setIsScroll: React.Dispatch<React.SetStateAction<boolean>> };
}): React.JSX.Element {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs());
  const settingTimesItem = useSelector((state: RootState) => state.minyans.settingTimesItem);
  const { rooms, roomsAsSelectOptions } = useSelector((state: RootState) => state.room);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState<boolean>(true);
  const hebrewDate = new HDate(selectedDate.toDate()).renderGematriya(); // Get date as string in Hebrew

  React.useEffect(() => {
    setLoading(true);
    const fetchMinyanim = async () => {
      try {
        // First fetch: get the default calendar minyanim
        const date = selectedDate.toDate(); // תאריך בפורמט ISO
        const calendarRes = await axios.get(`${API_BASE_URL}/minyan/getCalendar/${date}`);
        const minyanim = calendarRes.data.map((minyan: any) => {
          let isRoutine = minyan.specificDate?.isRoutine;
          if (!isRoutine && isMinyanInactiveForSelectedDate(selectedDate.toDate(), minyan.inactiveDates)) {
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
        dispatch(sortSettingTimesItem());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMinyanim();
  }, [dispatch, selectedDate]);
  const handleDelete = async (index: number) => {
    if (settingTimesItem[index].dateType === eDateType.calendar) {
      // Deleting Minyan
      axios
        .delete<{ deletedMinyan: MinyanDetails }>(`${API_BASE_URL}/minyan/${settingTimesItem[index].id}`)
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
    value: typeForEdit,
    index: number,
    field: keyof MinyanDetails,
    internalField?: string
  ): void => {
    const updateId = settingTimesItem[index].id;
    const fieldForEditDB = field === eFieldName.room ? eFieldName.roomId : field; // Synchronous dispatch update
    dispatch(updateSettingTimesValue({ index, field, value, internalField }));
    // Async API call can be handled here, but avoid returning Promise<void>
    const isInactiveDate = isMinyanInactiveForSelectedDate(
      selectedDate.toDate(),
      settingTimesItem[index].inactiveDates
    );
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
            dispatch(updateSettingTimesValue({ index, field: eFieldName.isEdited, value: true }));
            setTimeout(() => {
              setFalseEdited();
            }, 1000);
            if (field === eFieldName.endDate || field === eFieldName.startDate) dispatch(sortSettingTimesItem());
          }
        })
        .catch((err) => console.log('Error fetching data:', err));
    }
  };
  const handleChange = (
    value: typeForEdit,
    index: number,
    field: keyof MinyanDetails,
    internalField?: string
  ): void => {
    value && dispatch(updateSettingTimesValue({ index, field, value, internalField }));
  };
  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const handlePlusClick = async (index: number, location?: eLocationClick, isCalendar = false): Promise<any> => {
    const newRow: NewMinyan = {
      ...getNewMinyanObj(settingTimesItem, eDateType.calendar, rooms[0].id, index, location),
      specificDate: {
        date: selectedDate.toDate(),
        isRoutine: false,
      },
    };
    try {
      await axios
        .post<MinyanApi>(`${API_BASE_URL}/minyan`, { ...newRow })
        .then((res) => {
          const currentRoom = rooms.find((m) => m.id === res.data.roomId);
          const { roomId: room, ...data } = res.data;
          // Prepare the newRow object with or without specificDate based on isCalendar
          const dispatchData: MinyanDetails = {
            blink: data.blink,
            endDate: data.endDate,
            startDate: data.startDate,
            room: currentRoom!,
            id: data.id,
            isEdited: true,
            dateType: data.dateType,
            inactiveDates: data.inactiveDates || [],
            specificDate: {
              date: selectedDate.toISOString(), // Convert to ISO string
              isRoutine: false,
            },
            isRoutine: false,
          };

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

  // TODO: remove duplicate code
  const setFalseEdited = () => {
    settingTimesItem.map((_, index) => {
      dispatch(updateSettingTimesValue({ index, field: eFieldName.isEdited, value: false }));
    });
  };

  const getRowProps = (row: MinyanDetails): RowProps => {
    const isInactiveDate = isMinyanInactiveForSelectedDate(selectedDate.toDate(), row.inactiveDates);
    const editMode = isInactiveDate
      ? eRowEditMode.partiallyEnabled
      : row.dateType === eDateType.calendar || !row.dateType
        ? eRowEditMode.enabled
        : eRowEditMode.disabled;

    return {
      sx: {
        backgroundColor: isInactiveDate
          ? 'lightgray'
          : row.dateType !== eDateType.calendar && row.dateType
            ? 'lightgreen'
            : '',
      },
      editMode,
      deleteIcon: isInactiveDate ? <ArrowArcLeft size={24} /> : undefined,
    };
  };

  return (
    <>
      <JewishDatePicker
        label="Specific Date"
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        sx={{ paddingBottom: '2%', paddingLeft: '1%' }}
      />
      {loading ? (
        <Typography textAlign="center" variant="h6">
          Loading...
        </Typography>
      ) : (
        <Box style={{ height: 'calc(100% - 80px)', overflowY: 'auto' }}>
          <DataTable<MinyanDetails>
            columns={[
              ...getMinyansSettingsColumns({ roomArray: rooms, roomsOptionsArray: roomsAsSelectOptions }),
              isRoutineColumn,
            ]}
            edited
            onAddRowClick={handlePlusClick}
            onChangeInput={handleChange}
            onBlurInput={handleBlurInput}
            onDeleteClick={handleDelete}
            scrollAction={scrollAction}
            rows={settingTimesItem}
            getRowProps={getRowProps} // Call getRowProps for each row
          />
        </Box>
      )}
    </>
  );
}
