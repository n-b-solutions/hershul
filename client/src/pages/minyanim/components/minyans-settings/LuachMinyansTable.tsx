import React from 'react';
import { API_BASE_URL } from '@/const/api.const';
import {
  addLuachMinyanTimes,
  deleteLuachMinyan,
  setLuachMinyanTimes,
  sortLuachMinyanTimesItem,
  updateLuachMinyanTimesValue,
} from '@/redux/minyans/setting-times-slice';
import { RootState } from '@/redux/store';
import { getNewLuachMinyanObj } from '@/services/minyans.service';
import { Typography } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { eFieldName, eLocationClick } from '@/types/enums';
import { eFieldLuachMinyanTable, LuachMinyanRowType } from '@/types/luach-minyan.type';
import { DataTable } from '@/components/core/DataTable';

import {
  EditedLuachType,
  EditLuachMinyanValueType,
  LuachMinyanType,
} from '../../../../../../lib/types/luach-minyan.type';
import { eDateType } from '../../../../../../lib/types/minyan.type';
import { RoomType } from '../../../../../../lib/types/room.type';
import { getLuachMinyansSettingsColumns } from '../../config/minyans-settings.config';

interface LuachMinyansTableProps {
  dateType: eDateType;
  scrollAction: { isScroll: boolean; setIsScroll: React.Dispatch<React.SetStateAction<boolean>> };
}

const LuachMinyansTable: React.FC<LuachMinyansTableProps> = ({ dateType, scrollAction }) => {
  const dispatch = useDispatch();
  const luachMinyanTimesItem = useSelector((state: RootState) => state.minyans.luachMinyanTimesItem);
  const { rooms, roomsAsSelectOptions } = useSelector((state: RootState) => state.room);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoading(true);
    axios
      .get<LuachMinyanType[]>(`${API_BASE_URL}/luach-minyan/getMinyanimByDateType`, {
        params: { dateType },
      })
      .then((res) => {
        const setting = res.data.map((minyan: LuachMinyanType) => {
          return { ...minyan, isEdited: false };
        });
        dispatch(setLuachMinyanTimes({ setting }));
      })
      .then(() => {
        dispatch(sortLuachMinyanTimesItem());
      })
      .catch((err) => console.log('Error fetching data:', err))
      .finally(() => setLoading(false));
  }, [dateType, dispatch]);

  const handlePlusClick = async (index: number, location?: eLocationClick): Promise<any> => {
    const newRow = getNewLuachMinyanObj(luachMinyanTimesItem, dateType, rooms[0].id, index, location);
    await axios
      .post<LuachMinyanType>(`${API_BASE_URL}/luach-minyan`, { ...newRow })
      .then(async (res) => {
        dispatch(
          await addLuachMinyanTimes({
            newRow: {
              ...res.data,
              isEdited: true,
            },
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
      })
      .catch((err) => console.log('Error fetching data:', err));
  };

  const setFalseEdited = () => {
    luachMinyanTimesItem.map((_, index) => {
      dispatch(updateLuachMinyanTimesValue({ index, field: eFieldName.isEdited, value: false }));
    });
  };

  const handleChange = (
    value: EditLuachMinyanValueType,
    index: number,
    field: keyof LuachMinyanRowType,
    internalField?: string
  ): void => {
    value && dispatch(updateLuachMinyanTimesValue({ index, field, value, internalField }));
  };

  const handleDelete = (index: number) => {
    const minyanId = luachMinyanTimesItem[index].id;
    axios
      .delete(`${API_BASE_URL}/luach-minyan/${minyanId}`)
      .then((res) => dispatch(deleteLuachMinyan({ minyanId: res.data.id })))
      .catch((err) => console.log('Error fetching data:', err));
  };

  const handleBlurInput = (
    value: EditLuachMinyanValueType,
    index: number,
    field: keyof LuachMinyanRowType,
    internalField?: string
  ): void => {
    const updateId = luachMinyanTimesItem[index].id;
    const fieldForEdit = field === eFieldName.room ? eFieldName.roomId : field;
    axios
      .put<EditedLuachType>(`${API_BASE_URL}/luach-minyan/${updateId}`, {
        value,
        field: fieldForEdit,
        internalField,
      })
      .then((res) => {
        const editValue = rooms?.find((value: RoomType) => value.id === res.data.editedValue) || value;
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
  };

  return (
    <>
      {loading ? (
        <Typography textAlign="center" variant="h6">
          Loading...
        </Typography>
      ) : (
        <DataTable<LuachMinyanRowType, EditLuachMinyanValueType>
          columns={getLuachMinyansSettingsColumns({ roomArray: rooms, roomsOptionsArray: roomsAsSelectOptions })}
          edited
          onAddRowClick={handlePlusClick}
          onChangeInput={handleChange}
          onBlurInput={handleBlurInput}
          onDeleteClick={handleDelete}
          rows={luachMinyanTimesItem}
          stickyHeader
          scrollAction={scrollAction}
          title="Luach Minyans"
        />
      )}
    </>
  );
};

export default LuachMinyansTable;
