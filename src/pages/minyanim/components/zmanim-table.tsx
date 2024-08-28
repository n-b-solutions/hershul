'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';

import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';
import type { LineItemTable} from '@/types/minyanim';
import { EditTableCell } from './table-cell';
import { addSettingTimes } from '@/redux/setting-times/setting-times-slice';
import type { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';


const columns = [
  {
    formatter: (row, index): React.JSX.Element => (
      <EditTableCell column='blink' index={index} row={row}/>
    ),
    name: 'blink',
    width: '250px',
    field:"blink",
    padding:"none",
    align:'center',
    tooltip:'Time to start Blink before lights on'
  },
  {
    formatter: (row, index): React.JSX.Element => (
      <EditTableCell column='startTime'index={index} isDate row={row}/>
    ),
    padding:"none",
    name: 'startTime',
    width: '250px',
    field:"startTime",
    align:'center',
    tooltip:'Lights On'
  },
  {
    formatter: (row, index): React.JSX.Element => (
      <EditTableCell column='endTime' index={index} isDate row={row}/>
    ),
    padding:"none",
    name: 'endTime',
    width: '250px',
    field: "endTime",
    align:'center',
    tooltip:'Lights Off'
  },
  {
    formatter: (row, index): React.JSX.Element => ( 
      <EditTableCell column='room' index={index} row={row} />
    ),
  padding:"none",
    name: 'room',
    width: '250px',
    field: 'room',
    align:'center'
  }
] satisfies ColumnDef<LineItemTable>[];

export interface MoueHover{
  blink:{isInput:false,index:number},
    startTime:{isInput:false,index:number},
    endTime:{isInput:false,index:number},
    room:{isInput:false,index:number},
}

export function ZmanimTable(): React.JSX.Element {

  const settingTimesItem = useSelector((state:RootState)=>state.settingTimes.settingTimesItem);
  // const settingTimesItem =items?.settingTimesItem;

  const dispatch = useDispatch();

  const handlePlusClick= (index:number):void=>{
    dispatch(addSettingTimes({ index,newRow: { id: '66666', blink: null, startTime:null, endTime: null, room: null }}));
  }
 
  return (
    <Box sx={{ bgcolor: 'var(--mui-palette-background-level1)', p: 3 }}>
      <Card>
        <Divider />
        <Box sx={{ overflowX: 'auto' ,position:'relative'}}>
          <DataTable<LineItemTable> columns={columns}  handlePlusClick={handlePlusClick} rows={settingTimesItem}/>
      </Box>
      </Card>
    </Box>
  );
}
