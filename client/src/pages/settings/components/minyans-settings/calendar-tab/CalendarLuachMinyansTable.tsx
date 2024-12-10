import React from 'react';
import { API_BASE_URL } from '@/const/api.const';
import { isMinyanInactiveForSelectedDate } from '@/helpers/time.helper';
import {
  addLuachMinyanTimes,
  deleteLuachMinyan,
  setCurrentSelectedDate,
  setLuachMinyanTimes,
  sortLuachMinyanTimesItem,
  updateLuachMinyanTimesValue,
} from '@/redux/minyans/setting-times-slice';
import { RootState } from '@/redux/store';
import { getNewLuachMinyanObj } from '@/services/minyans.service';
import { Box, Typography } from '@mui/material';
import { ArrowArcLeft } from '@phosphor-icons/react';
import axios from 'axios';
import { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { eFieldName, eLocationClick, eRowEditMode } from '@/types/enums';
import { eFieldLuachMinyanTable, LuachCalendarRowType, LuachMinyanRowType } from '@/types/luach-minyan.type';
import { RowProps } from '@/types/table.type';
import { ImportMinyans } from '@/pages/settings/components/minyans-settings/ImportMinyans';
import { CalendarTableProps, isRoutineColumn } from '@/pages/settings/config/calendar.config';
import { getLuachMinyansSettingsColumns } from '@/pages/settings/config/minyans-settings.config';
import { DataTable } from '@/components/core/DataTable';

import {
  EditedLuachType,
  EditLuachMinyanValueType,
  LuachMinyanType,
} from '../../../../../../../lib/types/luach-minyan.type';
import { IdType } from '../../../../../../../lib/types/metadata.type';
import { eDateType, eMinyanType, SpecificDateType } from '../../../../../../../lib/types/minyan.type';

const CalendarLuachMinyansTable: React.FC<CalendarTableProps> = ({ selectedDate, scrollAction }) => {
  const dispatch = useDispatch();
  const luachMinyanTimesItem = useSelector((state: RootState) => state.minyans.luachMinyanTimesItem);
  const { rooms, roomsAsSelectOptions } = useSelector((state: RootState) => state.room);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoading(true);
    const fetchMinyanim = async () => {
      try {
        // First fetch: get the default calendar minyanim
        const date = selectedDate.toDate();
        const calendarRes = await axios.get(`${API_BASE_URL}/luach-minyan/getCalendar/${date}`);
        const minyanim = calendarRes.data.map((minyan: any) => {
          let isRoutine = minyan.specificDate?.isRoutine;
          if (!isRoutine && isMinyanInactiveForSelectedDate(selectedDate.toDate(), minyan.inactiveDates)) {
            const inactiveDate = minyan.inactiveDates.find(
              (item: any) =>
                new Date(item.date).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
            );
            isRoutine = inactiveDate?.isRoutine;
          }
          return {
            ...minyan,
            isRoutine,
          };
        });

        // Dispatch to Redux store
        dispatch(setLuachMinyanTimes({ setting: minyanim }));
        dispatch(sortLuachMinyanTimesItem());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMinyanim();
  }, [dispatch, selectedDate]);

  const handleDelete = async (index: number) => {
    if (luachMinyanTimesItem[index].dateType === eDateType.calendar) {
      // Deleting Minyan
      axios
        .delete<IdType>(`${API_BASE_URL}/luach-minyan/${luachMinyanTimesItem[index].id}`)
        .then((res) => dispatch(deleteLuachMinyan({ minyanId: res.data.id })))
        .catch((err) => console.log('Error fetching data:', err));
    } else {
      const minyanId = luachMinyanTimesItem[index].id;

      try {
        const currentMinyanRes = luachMinyanTimesItem[index] as LuachCalendarRowType;
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
          await axios.put(`${API_BASE_URL}/luach-minyan/removeInactiveDates/${minyanId}`, {
            date: selectedDate.toISOString(), // Keep it as string
            isRoutine: isRoutine,
          });

          const updatedInactiveDates = currentInactiveDates.filter((inactiveDate) => {
            const elementDate = new Date(inactiveDate.date).toISOString().split('T')[0];
            return elementDate !== selectedDate.toISOString().split('T')[0];
          });

          dispatch(
            updateLuachMinyanTimesValue({
              index,
              field: 'inactiveDates',
              value: updatedInactiveDates,
            })
          );
          dispatch(
            updateLuachMinyanTimesValue({
              index,
              field: 'isRoutine' as keyof LuachMinyanRowType, //TODO: fix! might cause errors
              value: false,
            })
          );
        } else {
          // If the date does not exist, add it
          await axios.put(`${API_BASE_URL}/luach-minyan/addInactiveDates/${minyanId}`, {
            date: selectedDate.toISOString(),
            isRoutine: isRoutine || false,
          });

          const updatedInactiveDates: SpecificDateType[] = [
            ...currentInactiveDates,
            { date: selectedDate.toISOString(), isRoutine: isRoutine || false }, // Keep it as string
          ];
          dispatch(
            updateLuachMinyanTimesValue({
              index,
              field: 'inactiveDates',
              value: updatedInactiveDates,
            })
          );
          dispatch(
            updateLuachMinyanTimesValue({
              index,
              field: 'isRoutine' as keyof LuachMinyanRowType, //TODO: fix! might cause errors
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
    value: EditLuachMinyanValueType,
    index: number,
    field: keyof LuachMinyanRowType,
    internalField?: string
  ): void => {
    const updateId = luachMinyanTimesItem[index].id;
    let fieldForEditDB = field === eFieldName.room ? eFieldName.roomId : field; // Synchronous dispatch update
    dispatch(updateLuachMinyanTimesValue({ index, field, value, internalField }));
    // Async API call can be handled here, but avoid returning Promise<void>
    const isInactiveDate = isMinyanInactiveForSelectedDate(
      selectedDate.toDate(),
      luachMinyanTimesItem[index].inactiveDates
    );
    if (isInactiveDate) {
      axios.put(`${API_BASE_URL}/luach-minyan/updateInactiveDate/${updateId}`, {
        date: selectedDate.toISOString(),
        isRoutine: value,
      });
    } else {
      let internalFieldForEditDB = internalField;
      if (field === (eFieldName.isRoutine as keyof LuachMinyanRowType)) {
        //TODO: fix! might cause errors
        fieldForEditDB = eFieldName.specificDate;
        internalFieldForEditDB = eFieldName.isRoutine;
      }
      axios
        .put<EditedLuachType>(`${API_BASE_URL}/luach-minyan/${updateId}`, {
          value,
          field: fieldForEditDB,
          internalField: internalFieldForEditDB,
        })
        .then((res) => {
          const editValue = rooms?.find((room) => room.id === res.data.editedValue) || value;
          if (editValue) {
            dispatch(updateLuachMinyanTimesValue({ index, field, value: editValue, internalField }));
            dispatch(updateLuachMinyanTimesValue({ index, field: eFieldName.isEdited, value: true }));
            setTimeout(() => {
              setFalseEdited();
            }, 1000);
            if (
              [
                eFieldLuachMinyanTable.timeOfDay.toString(),
                eFieldLuachMinyanTable.relativeTime.toString(),
                eFieldLuachMinyanTable.duration.toString(),
              ].includes(field.toString())
            ) {
              dispatch(sortLuachMinyanTimesItem());
            }
          }
        })
        .catch((err) => console.log('Error fetching data:', err));
    }
  };

  const handleChange = (
    value: EditLuachMinyanValueType,
    index: number,
    field: keyof LuachMinyanRowType,
    internalField?: string
  ): void => {
    value != null && dispatch(updateLuachMinyanTimesValue({ index, field, value, internalField }));
  };

  const handlePlusClick = async (index: number, location?: eLocationClick, isCalendar = false): Promise<any> => {
    const newRow = {
      ...getNewLuachMinyanObj(luachMinyanTimesItem, eDateType.calendar, rooms[0].id, index, location),
      specificDate: {
        date: selectedDate.toDate(),
        isRoutine: false,
      },
    };
    try {
      await axios
        .post<LuachMinyanType>(`${API_BASE_URL}/luach-minyan`, { ...newRow })
        .then((res) => {
          // Prepare the newRow object with or without specificDate based on isCalendar
          const dispatchData = {
            ...res.data,
            specificDate: {
              date: selectedDate.toISOString(), // Convert to ISO string
              isRoutine: false,
            },
            isEdited: true,
            isRoutine: false,
          };

          dispatch(
            addLuachMinyanTimes({
              newRow: dispatchData,
            })
          );
        })
        .then(async () => {
          dispatch(await sortLuachMinyanTimesItem());
        })
        .then(() => {
          setTimeout(() => {
            setFalseEdited();
            dispatch(
              updateLuachMinyanTimesValue({
                index: luachMinyanTimesItem.length,
                field: eFieldName.isEdited,
                value: false,
              })
            );
          }, 1000);
        });
    } catch (err) {
      console.log('Error adding new minyan:', err);
    }
  };

  const setFalseEdited = () => {
    luachMinyanTimesItem.map((_, index) => {
      dispatch(updateLuachMinyanTimesValue({ index, field: eFieldName.isEdited, value: false }));
    });
  };

  const getRowProps = (row: LuachMinyanType): RowProps => {
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
      {loading ? (
        <Typography textAlign="center" variant="h6">
          Loading...
        </Typography>
      ) : (
        <Box style={{ height: '100%', overflowY: 'auto' }}>
          <DataTable<LuachMinyanType, EditLuachMinyanValueType>
            columns={[
              ...getLuachMinyansSettingsColumns({ roomArray: rooms, roomsOptionsArray: roomsAsSelectOptions }),
              isRoutineColumn,
            ]}
            edited
            onAddRowClick={handlePlusClick}
            onChangeInput={handleChange}
            onBlurInput={handleBlurInput}
            onDeleteClick={handleDelete}
            scrollAction={scrollAction}
            rows={luachMinyanTimesItem}
            getRowProps={getRowProps}
            title="Luach Minyans"
            noDataOption={<ImportMinyans tableType={eMinyanType.luachMinyan} />}
            stickyHeader
          />
        </Box>
      )}
    </>
  );
};

export default CalendarLuachMinyansTable;
