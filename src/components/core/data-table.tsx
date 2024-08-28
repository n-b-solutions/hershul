'use client';

import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import type { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box } from '@mui/system';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { PlusCircle } from '@phosphor-icons/react/dist/ssr/PlusCircle';
import {  Tooltip, Typography } from '@mui/material';
import { WarningCircle as WarningIcon } from '@phosphor-icons/react/dist/ssr/WarningCircle';

export interface ColumnDef<TRowModel> {
  align?: 'left' | 'right' | 'center';
  field?: keyof TRowModel;
  formatter?: (row: TRowModel, index: number) => React.ReactNode;
  hideName?: boolean;
  name: string;
  width?: number | string;
  padding?: Padding;
  tooltip?:string;
}
type Padding =  "normal" | "checkbox" | "none";
type RowId = number | string;


export interface DataTableProps<TRowModel> extends Omit<TableProps, 'onClick'> {
  columns: ColumnDef<TRowModel>[];
  hideHead?: boolean;
  hover?: boolean;
  onClick?: (event: React.MouseEvent, row: TRowModel) => void;
  onDeselectAll?: (event: React.ChangeEvent) => void;
  onDeselectOne?: (event: React.ChangeEvent, row: TRowModel) => void;
  onSelectAll?: (event: React.ChangeEvent) => void;
  onSelectOne?: (event: React.ChangeEvent, row: TRowModel) => void;
  rows: TRowModel[];
  selectable?: boolean;
  selected?: Set<RowId>;
  uniqueRowId?: (row: TRowModel) => RowId;
  handlePlusClick?:(index:number, isFirst?:boolean)=>void;
}


export function DataTable<TRowModel extends object & { id?: RowId | null }>({
  columns,
  hideHead,
  hover,
  onClick,
  onDeselectAll,
  onDeselectOne,
  onSelectOne,
  onSelectAll,
  rows,
  selectable,
  selected,
  uniqueRowId,
  handlePlusClick,
  ...props
}: DataTableProps<TRowModel>): React.JSX.Element {
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;
  const [isHover,setIsHover]=React.useState<{isHover:boolean,index:number}>({isHover:false,index:0})
  const isToShow = useSelector((state:RootState)=>state.settingTimes.isToShowPlus);

  const handleHover=(index:number):void=>{
    handlePlusClick && setIsHover({index,isHover:true})
  }

  const handleLeave=():void=>{
    handlePlusClick && setIsHover({...isHover,isHover:false})
  }

  const getTop =(index:number):string=>{
  const  top= (index+1)*55+38;
    return `${top.toString()}px`;
  }

  return (
    <Table {...props}>
      <TableHead sx={{ ...(hideHead && { visibility: 'collapse', '--TableCell-borderWidth': 0 }) }}>
        <TableRow>
          {selectable ? (
            <TableCell padding="checkbox" sx={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}>
              <Checkbox
                checked={selectedAll}
                indeterminate={selectedSome}
                onChange={(event: React.ChangeEvent) => {
                  if (selectedAll) {
                    onDeselectAll?.(event);
                  } else {
                    onSelectAll?.(event);
                  }
                }}
              />
              
            </TableCell>
          ) : null}
          {columns.map(
            (column): React.JSX.Element => (
              <TableCell
              key={column.name}
                sx={{
                  width: column.width,
                  minWidth: column.width,
                  maxWidth: column.width,
                  ...(column.align && { textAlign: column.align }),
                }}
              >
                {column.hideName ? null : column.name}
                {column.tooltip ? <Tooltip arrow  title={
                  <Typography
                   sx={{ width:'100px',textAlign:'center'}} variant="body1">{column?.tooltip}
                  </Typography>}>
                <WarningIcon color='#635bff' display='inline' size={20}/>
                    </Tooltip> : null}
                
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index): React.JSX.Element => {
          const rowId = row.id ? row.id : uniqueRowId?.(row);
          const rowSelected = rowId ? selected?.has(rowId) : false;

          return (<TableRow
          hover={hover}
              key={rowId ?? index}
             onMouseLeave={handleLeave}
              onMouseOver={ ()=>{ handleHover(index); } }
              selected={rowSelected}
              {...(onClick && {
                onClick: (event: React.MouseEvent) => {
                  onClick(event, row);
                },
                
              })}
              sx={{ ...(onClick && { cursor: 'pointer' }),...(handlePlusClick && {positions:'relative'}) }}
            >
              {selectable ? (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={rowId ? rowSelected : false}
                    onChange={(event: React.ChangeEvent) => {
                      if (rowSelected) {
                        onDeselectOne?.(event, row);
                      } else {
                        onSelectOne?.(event, row);
                      }
                    } }
                    onClick={(event: React.MouseEvent) => {
                      if (onClick) {
                        event.stopPropagation();
                      }
                    } } />
                </TableCell>
              ) : null}
             
              {columns.map(
                (column): React.JSX.Element => (
                  <TableCell key={column.name} padding={column?.padding} sx={{ ...(column.align && { textAlign: column.align }) }}>
                    {(column.formatter
                      ? column.formatter(row,index)
                      : column.field
                        ? row[column.field]
                        : null) as React.ReactNode}
                  </TableCell>
                )
              )}
               {handlePlusClick && isToShow && isHover?.isHover && isHover.index===index && index===0 ?
             <TableCell sx={{padding:'0px',width:'0px'}}>
             <Box  
               onClick={()=>{handlePlusClick(index,true); }}  
               sx={{position:'absolute',left:'50%',top:'39px',width:'25px',color:'#635bff'}}><PlusCircle size={32} />
               </Box>
             </TableCell> : null}
            {handlePlusClick && isToShow && isHover?.isHover && isHover.index===index ?
             <TableCell sx={{padding:'0px',width:'0px'}}>
             <Box  
               onClick={()=>{ handlePlusClick(index); }}  
               sx={{position:'absolute',left:'50%',top:getTop(index),width:'25px',color:'#635bff'}}><PlusCircle size={32} />
               </Box>
             </TableCell> : null}
            </TableRow>

          );
        })}
      </TableBody>
      
    </Table>
  );
}
