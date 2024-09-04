'use client';

import * as React from 'react';
import { addSettingTimes, setSettingTimes, updateSettingTimesValue } from '@/state/setting-times/setting-times-slice';
import type { RootState } from '@/state/store';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import type { LineItemTable } from '@/types/minyanim';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';

const styleTypography = {
  display: 'grid',
  justifyItems: 'center',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  height: '54px',
};

const getFormat = (value: number | null | string): React.JSX.Element => {
  return (
    <Typography component="span" position="relative" sx={{ ...styleTypography }} variant="inherit">
      {value}
    </Typography>
  );
};

const API_BASE_URL = import.meta.env.VITE_LOCAL_SERVER;

export function ZmanimTable(props: { typeDate: string }): React.JSX.Element {
  const settingTimesItem = useSelector((state: RootState) => state.settingTimes.settingTimesItem);
  const dispatch = useDispatch();

  React.useEffect(() => {
    axios
      .get(`${API_BASE_URL}/minyan/getMinyanimByDateType/${props.typeDate}`)
      .then((res) => {
        console.log(res.data);
        dispatch(setSettingTimes({ setting: res.data }));
      })
      .catch((err) => console.log('Error fetching data:', err));
  }, [props.typeDate]);

  const handlePlusClick = (index: number): void => {
    dispatch(addSettingTimes({ index, newRow: { id: '', blink: null, startTime: null, endTime: null, room: null } }));
  };

  const columns = [
    {
      formatter: (row): React.JSX.Element => getFormat(row.blink),
      name: 'blink',
      width: '250px',
      field: 'blink',
      padding: 'none',
      align: 'center',
      tooltip: 'Time to start Blink before lights on',
    },
    {
      formatter: (row): React.JSX.Element => getFormat(row.startTime),
      padding: 'none',
      name: 'startTime',
      width: '250px',
      field: 'startTime',
      align: 'center',
      tooltip: 'Lights On',
    },
    {
      formatter: (row): React.JSX.Element => getFormat(row.endTime),
      padding: 'none',
      name: 'endTime',
      width: '250px',
      field: 'endTime',
      align: 'center',
      tooltip: 'Lights Off',
    },
    {
      formatter: (row): React.JSX.Element => getFormat(row.room),
      padding: 'none',
      name: 'room',
      width: '250px',
      field: 'room',
      align: 'center',
    },
  ] satisfies ColumnDef<LineItemTable>[];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    column: keyof LineItemTable
  ): void => {
    dispatch(updateSettingTimesValue({ index, column, value: e.target.value }));
  };

  return (
    <Box sx={{ bgcolor: 'var(--mui-palette-background-level1)', p: 3 }}>
      <Card>
        <Divider />
        <Box sx={{ overflowX: 'auto', position: 'relative' }}>
          <DataTable<LineItemTable>
            columns={columns}
            edited
            onAddRowClick={handlePlusClick}
            onChangeInput={handleChange}
            rows={settingTimesItem}
          />
        </Box>
      </Card>
    </Box>
  );
}
