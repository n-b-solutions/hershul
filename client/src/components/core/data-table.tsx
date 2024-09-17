'use client';

import * as React from 'react';
import { Grid, IconButton, OutlinedInput, SelectChangeEvent, TextField, Tooltip, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import type { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Trash } from '@phosphor-icons/react';
import { WarningCircle as WarningIcon } from '@phosphor-icons/react/dist/ssr/WarningCircle';

import { SelectOption } from '@/types/room';
import { AddRow } from '@/pages/minyanim/components/add-row';

import { EditTableCellInputs } from './edit-table-cell-inputs';

export interface ColumnDef<TRowModel> {
  align?: 'left' | 'right' | 'center';
  field?: keyof TRowModel;
  formatter?: (row: TRowModel, index: number) => React.ReactNode;
  valueForEdit?: (row: TRowModel) => any;
  valueOption?: any & { id: string }[];
  typeEditinput?: string;
  hideName?: boolean;
  name: string;
  width?: number | string;
  padding?: Padding;
  tooltip?: string;
  selectOptions?: SelectOption[];
}
type Padding = 'normal' | 'checkbox' | 'none';
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
  onAddRowClick?: (index: number, location: number) => void;
  edited?: boolean;
  onChangeInput?: (value: TRowModel[keyof TRowModel], index: number, fieldName: keyof TRowModel) => void;
  onBlurInput?: (value: TRowModel[keyof TRowModel], index: number, fieldName: keyof TRowModel) => void;
  onDeleteClick?: (index: number) => void;
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
  onAddRowClick,
  edited,
  onChangeInput,
  onBlurInput,
  onDeleteClick,
  ...props
}: DataTableProps<TRowModel>): React.JSX.Element {
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [isCellClick, setIsCellClick] = React.useState<{ isclick: boolean; id: string }>({ isclick: false, id: '' });
  const [isShowPlus, setIsShowPlus] = React.useState<boolean>(false);
  const [isShowDelete, setIsToShowDelete] = React.useState<{ hover: boolean; index: number }>({
    hover: false,
    index: 0,
  });

  const cellRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    cellRef.current?.focus();
  });

  const handleStatusClick = (event: React.MouseEvent<HTMLSpanElement>): void => {
    (event.target as HTMLTextAreaElement).localName === 'div' && setIsShowPlus(true);
  };

  const handleClick = (event: React.MouseEvent<HTMLSpanElement>): void => {
    const id = (event.currentTarget as HTMLTextAreaElement).id;
    setIsCellClick({ isclick: true, id });
  };

  const handleBlurInput = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    value?: TRowModel[keyof TRowModel],
    index: number = 0,
    fieldName?: keyof TRowModel
  ): void => {
    onBlurInput && value && fieldName && onBlurInput(value as TRowModel[keyof TRowModel], index, fieldName);
    const id = (event.currentTarget as HTMLInputElement).id;
    setIsCellClick({ isclick: false, id });
    setIsShowPlus(false);
  };

  const getValue = (index: number, field: keyof TRowModel): TRowModel[keyof TRowModel] => {
    const currentRow = rows[index];
    const value = currentRow[field];
    return value;
  };

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
                {column.tooltip ? (
                  <Tooltip
                    arrow
                    title={
                      <Typography sx={{ width: '100px', textAlign: 'center' }} variant="body1">
                        {column?.tooltip}
                      </Typography>
                    }
                  >
                    <WarningIcon color="#635bff" display="inline" size={20} />
                  </Tooltip>
                ) : null}
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index): React.JSX.Element => {
          const rowId = row.id ? row.id : uniqueRowId?.(row);
          const rowSelected = rowId ? selected?.has(rowId) : false;

          return (
            <TableRow
              onMouseOver={() => {
                setIsToShowDelete && setIsToShowDelete({ hover: true, index });
              }}
              hover={hover}
              key={rowId ?? index}
              selected={rowSelected}
              {...(onClick && {
                onClick: (event: React.MouseEvent) => {
                  onClick(event, row);
                },
              })}
              sx={{ ...(onClick && { cursor: 'pointer' }), ...(onAddRowClick && { positions: 'relative' }) }}

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
                    }}
                    onClick={(event: React.MouseEvent) => {
                      if (onClick) {
                        event.stopPropagation();
                      }
                    }}
                  />
                </TableCell>
              ) : null}

              {columns.map(
                (column): React.JSX.Element => (
                  <TableCell
                    id={column.field && column.field?.toString() + index}
                    key={column.name}
                    onClick={(e) => {
                      edited && handleClick(e);
                    }}
                    padding={column?.padding}
                    sx={{ ...(column.align && { textAlign: column.align }) }}
                  >
                    {edited &&
                    column.field &&
                    isCellClick.isclick &&
                    onChangeInput &&
                    isCellClick.id === column.field.toString() + index ? (
                      <EditTableCellInputs
                        fieldName={column.field}
                        cellRef={cellRef}
                        index={index}
                        handleBlur={handleBlurInput}
                        value={column.valueForEdit ? column.valueForEdit(row) : getValue(index, column.field)}
                        handleChangeInput={onChangeInput}
                        editType={column.typeEditinput}
                        valueOption={column.valueOption && column.valueOption}
                        selectOptions={column.selectOptions && column.selectOptions}
                      />
                    ) : (
                      ((column.formatter
                        ? column.formatter(row, index)
                        : column.field
                          ? row[column.field]
                          : null) as React.ReactNode)
                    )}
                  </TableCell>
                )
              )}
              {onAddRowClick && !isShowPlus ? (
                <TableCell
                  onClick={(e) => {
                    handleStatusClick(e);
                  }}
                  sx={{ padding: '0px', width: '0px' }}
                >
                  <AddRow index={index} onPlusClick={onAddRowClick} />
                </TableCell>
              ) : null}
              {onDeleteClick && isShowDelete.hover && isShowDelete.index === index ? (
                <TableCell
                  sx={{
                    padding: '0px',
                    width: '0px',
                    position: 'relative',
                  }}
                >
                  <IconButton
                    onClick={() => onDeleteClick(index)}
                    sx={{ position: 'absolute', right: '20px', top: '9px' }}
                  >
                    <Trash size={24} />
                  </IconButton>
                </TableCell>
              ) : null}
            </TableRow>
          );
        })}
        {onAddRowClick && (
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
