import * as React from 'react';
import { NO_DATA } from '@/const/minyans.const';
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import type { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PlusCircle, Trash } from '@phosphor-icons/react';
import { WarningCircle as WarningIcon } from '@phosphor-icons/react/dist/ssr/WarningCircle';

import { eLocationClick, eRowEditMode } from '@/types/enums';
import { ColumnDef, RowProps } from '@/types/table.type';
import { ImportMinyans } from '@/pages/minyanim/components/minyans-settings/ImportMinyans';

import { EditTableCellInputs } from './edit-table-cell-inputs';

type RowId = number | string;
interface DataTableProps<TRowModel, TEdit> extends Omit<TableProps, 'onClick'> {
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
  onAddRowClick?: (index: number, location?: eLocationClick) => void;
  edited?: boolean;
  onChangeInput?: (value: TEdit, index: number, fieldName: keyof TRowModel, internalField?: string) => void;
  onBlurInput?: (value: TEdit, index: number, fieldName: keyof TRowModel, internalField?: string) => void;
  onDeleteClick?: (index: number) => void;
  scrollAction?: { isScroll: boolean; setIsScroll: React.Dispatch<React.SetStateAction<boolean>> };
  getRowProps?: (row: TRowModel) => RowProps;
  title?: string;
  noDataOption?: React.ReactNode;
  clickedRowIndex?: number | null; 
  setClickedRowIndex?: React.Dispatch<React.SetStateAction<number | null>>; // Add this prop
}

export function DataTable<
  TRowModel extends object & { id?: RowId | null; dateType?: string; isEdited?: boolean },
  TEdit = any,
>({
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
  scrollAction,
  getRowProps,
  title,
  noDataOption,
  clickedRowIndex, 
  setClickedRowIndex, 
  ...props
}: DataTableProps<TRowModel, TEdit>): React.JSX.Element {
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;
  const [cellClicked, setCellClicked] = React.useState<{
    isClicked: boolean;
    id: string;
    index?: number;
  }>({
    isClicked: false,
    id: '',
  });
  const [plusMode, setPlusMode] = React.useState<{
    mode: eLocationClick | null;
    index?: number;
    right?: number;
    height?: number;
  }>({
    mode: null,
  });
  const [isShowDelete, setIsToShowDelete] = React.useState<{ hover: boolean; index: number }>({
    hover: false,
    index: 0,
  });
  const tableBodyRef = React.useRef<HTMLTableSectionElement>(null);
  const cellRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLTableRowElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLSpanElement>): void => {
    const { id } = event.currentTarget as HTMLTextAreaElement;
    setCellClicked({ isClicked: true, id });
    setPlusMode({ mode: null });
  };

  const handleBlurInput = (
    event: React.FocusEvent | React.KeyboardEvent,
    value?: TEdit,
    index: number = 0,
    fieldName?: keyof TRowModel,
    internalField?: string
  ): void => {
    if (onBlurInput && value != undefined && fieldName) {
      const editValue: TEdit = value as TEdit;
      onBlurInput(editValue, index, fieldName, internalField);
    }
    const id = (event.target as HTMLInputElement).id;
    setCellClicked({ isClicked: false, id, index });
    setPlusMode({ mode: null });
  };

  const handleChangeInput = (
    value: TEdit,
    index: number,
    fieldName?: keyof TRowModel,
    internalField?: string
  ): void => {
    if (onChangeInput && fieldName) {
      onChangeInput(value, index, fieldName, internalField);
    }
  };

  const getValue = (index: number, field: keyof TRowModel): TRowModel[keyof TRowModel] => {
    const currentRow = rows[index];
    const value = currentRow[field];
    return value;
  };

  const handleMouseHover = (event: any, index: number) => {
    scrollAction?.setIsScroll(false);
    const currentRowElement = tableBodyRef.current?.children[index]?.getBoundingClientRect();
    if (currentRowElement) {
      const { clientY: mouseY } = event;
      const { width: rowWidth, height: rowHeight, y: rowY } = currentRowElement;
      const middleY = rowY + rowHeight / 2;
      if (mouseY < middleY) {
        setPlusMode({ mode: eLocationClick.top, index, right: rowWidth / 2, height: rowHeight });
      } else {
        setPlusMode({ mode: eLocationClick.bottom, index, right: rowWidth / 2, height: rowHeight });
      }
    }
  };

  // The offset calculation here is not accurate enough and does not fit all cases, so it is temporary and subject to change.
  const interpolate = (x1: number, y1: number, x2: number, y2: number, x: number) => {
    return y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
  };

  const getPlusYPosition = (rowHeight: number) => {
    const topOffset = interpolate(54.8, 38, 102.8, 86, rowHeight);
    const bottomOffset = interpolate(54.8, 33, 102.8, 81, rowHeight);
    return plusMode.mode === eLocationClick.bottom ? { top: `${bottomOffset}px` } : { bottom: `${topOffset}px` };
  };

  React.useEffect(() => {
    scrollAction?.isScroll && onAddRowClick && setPlusMode({ mode: null });
  }, [scrollAction?.isScroll]);

  React.useEffect(() => {
    cellRef.current?.focus();
    rowRef?.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  return (
    <Table {...props}>
      <colgroup>
        {columns.map((column) => (
          <col style={{ width: `${100 / columns.length}%` }} key={column.name} />
        ))}
      </colgroup>
      <TableHead sx={{ ...(hideHead && { visibility: 'collapse', '--TableCell-borderWidth': 0 }) }}>
        {title && (
          <TableRow>
            <TableCell colSpan={columns.length}>
              <Typography variant="h6">{title}</Typography>
            </TableCell>
          </TableRow>
        )}
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
                    <WarningIcon color="#635bff" display="inline" size={15} />
                  </Tooltip>
                ) : null}
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
      <TableBody ref={tableBodyRef}>
        {rows.map((row, index): React.JSX.Element => {
          const rowId = row.id ? row.id : uniqueRowId?.(row);
          const rowSelected = rowId ? selected?.has(rowId) : false;
          const rowProps = getRowProps && getRowProps(row);

          return (
            <TableRow
              ref={row.isEdited ? rowRef : null}
              onMouseMove={(event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => handleMouseHover(event, index)}
              onMouseOver={() => setIsToShowDelete({ hover: true, index })}
              onMouseLeave={() => {
                setIsToShowDelete && setIsToShowDelete({ hover: false, index });
                setPlusMode({ mode: null });
              }}
              hover={hover}
              key={rowId ?? index}
              selected={rowSelected}
              {...(onClick && {
                onClick: (event: React.MouseEvent) => {
                  onClick(event, row);
                },
              })}
              sx={{
                ...(onClick && { cursor: 'pointer' }),
                ...(onAddRowClick && {
                  positions: 'relative',
                }),
                ...(edited && {
                  bgcolor: row.isEdited ? '#dcdfe4' : 'none',
                }),
                ...(clickedRowIndex === index && { bgcolor: 'red' }),
                ...(rowProps?.sx ? rowProps?.sx : {}),
              }}
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
                      edited && rowProps?.editMode !== eRowEditMode.disabled && handleClick(e);
                    }}
                    padding={column?.padding}
                    sx={{ ...(column.align && { textAlign: column.align }) }}
                  >
                    {edited &&
                    column.field &&
                    cellClicked.isClicked &&
                    (!rowProps?.editMode ||
                      rowProps?.editMode === eRowEditMode.enabled ||
                      (rowProps?.editMode === eRowEditMode.partiallyEnabled && column.editable == true)) &&
                    onChangeInput &&
                    cellClicked.id === column.field.toString() + index ? (
                      <EditTableCellInputs
                        fieldName={column.field}
                        cellRef={cellRef}
                        index={index}
                        handleBlur={(event, value) =>
                          handleBlurInput(event, value, index, column.field, column.internalField)
                        }
                        value={column.valueForEdit ? column.valueForEdit(row) : getValue(index, column.field)}
                        handleChangeInput={(value) =>
                          handleChangeInput(value, index, column.field, column.internalField)
                        }
                        editType={column.editInputType}
                        valueOption={column.valueOption && column.valueOption}
                        selectOptions={column.selectOptions && column.selectOptions}
                      />
                    ) : (
                      ((column.formatter
                        ? column.formatter(
                            row,
                            index,
                            !(rowProps?.editMode === eRowEditMode.enabled || !rowProps?.editMode)
                          )
                        : column.field
                          ? row[column.field as keyof TRowModel]
                          : null) as React.ReactNode)
                    )}
                  </TableCell>
                )
              )}
              {onAddRowClick && !cellClicked.isClicked && plusMode.mode && plusMode.index === index ? (
                <TableCell sx={{ padding: '0px', width: '0px', position: 'relative' }}>
                  <Grid
                    onClick={() => onAddRowClick(index, plusMode.mode!)}
                    sx={{
                      position: 'absolute',
                      width: '25px',
                      color: '#635bff',
                      zIndex: '999',
                      right: `${plusMode.right || 0}px`,
                      ...getPlusYPosition(plusMode.height || 0),
                    }}
                  >
                    <PlusCircle size={32} />
                  </Grid>
                </TableCell>
              ) : null}
              {onDeleteClick && isShowDelete.hover && isShowDelete.index === index && !cellClicked.isClicked ? (
                <TableCell
                  sx={{
                    padding: '0px',
                    width: '0px',
                    position: 'relative',
                  }}
                >
                  <IconButton
                    disabled={!!rowRef?.current}
                    onClick={() => {
                      onDeleteClick(index);
                      setClickedRowIndex?.(index); 
                    }}
                    sx={{ position: 'absolute', right: '20px', top: '9px' }}
                  >
                    {rowProps?.deleteIcon || <Trash size={24} />}
                  </IconButton>
                </TableCell>
              ) : null}
            </TableRow>
          );
        })}
        {onAddRowClick && !rows.length && (
          <TableRow
            onMouseOver={() => setPlusMode({ mode: null, index: -1 })}
            onMouseLeave={() => setPlusMode({ mode: null })}
            sx={{ position: 'relative' }}
          >
            <TableCell sx={{ padding: '15px' }} colSpan={columns.length}>
              <Grid container display="grid">
                <Grid
                  onClick={() => onAddRowClick(-1)}
                  sx={{
                    position: 'absolute',
                    width: '25px',
                    color: '#635bff',
                    zIndex: '999',
                    right: '50%',
                    bottom: '73px',
                  }}
                >
                  {plusMode.index === -1 && <PlusCircle size={32} />}
                </Grid>
                <Typography sx={{ textAlign: 'center' }}>{NO_DATA}</Typography>
                {noDataOption}
              </Grid>
            </TableCell>
          </TableRow>
        )}
        {onAddRowClick && rows.length ? (
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  );
}