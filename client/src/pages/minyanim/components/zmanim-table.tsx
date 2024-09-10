'use client';

import * as React from 'react';
import { addSettingTimes, setSettingTimes, updateSettingTimesValue } from '@/state/setting-times/setting-times-slice';
import type { RootState } from '@/state/store';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import dayjs from 'dayjs';
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
    dispatch(addSettingTimes({ index, newRow: { id: '', blink: null, startDate: null, endDate: null, room: {nameRoom:'',status:''} } }));
  };

  const columns = [
    {
      formatter: (row): React.JSX.Element => getFormat(row.blink),
      typeEditinput: 'text',
      name: 'blink',
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
      name: 'startDate',
      width: '250px',
      field: 'startDate',
      align: 'center',
      tooltip: 'Lights On',
    },
    {
      formatter: (row): React.JSX.Element => getFormat(row.endDate),
      typeEditinput: 'time',
      padding: 'none',
      name: 'endDate',
      width: '250px',
      field: 'endDate',
      align: 'center',
      tooltip: 'Lights Off',
    },
    {
      formatter: (row): React.JSX.Element => getFormat(row.room?.nameRoom),
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
    console.log(e.target.type);
    const value = e.target.type === 'time' ?e.target.value : e.target.value;
    dispatch(updateSettingTimesValue({ index, column, value}));
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
