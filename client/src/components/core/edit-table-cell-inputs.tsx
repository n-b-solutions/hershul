import React, { Ref, useState } from 'react';
import { OutlinedInput, Select, SelectChangeEvent, TextField } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import dayjs from 'dayjs';

import { SelectOption } from '@/types/room';
import { Option } from '@/components/core/option';

export function EditTableCellInputs<TRowModel extends object>(props: {
  value: any;
  handleChangeInput: (value: TRowModel[keyof TRowModel], index: number, field: keyof TRowModel) => void;
  cellRef: Ref<any>;
  index: number;
  fieldName: keyof TRowModel;
  handleBlur: (
    event: React.FocusEvent | React.KeyboardEvent,
    value?: TRowModel[keyof TRowModel],
    index?: number,
    fieldName?: keyof TRowModel
  ) => void;
  editType?: string;
  selectOptions?: SelectOption[];
  valueOption?: any & { id: string }[];
}): React.JSX.Element {
  const [select, setSelect] = useState(props.value);

  const handleChange = (event: SelectChangeEvent<any>) => {
    setSelect(event.target.value);
    const editValue = props.valueOption?.find((value: any) => value.id === event.target.value);
    props.handleChangeInput && props.handleChangeInput(editValue, props.index, props.fieldName);
  };

  const handle = (value: TRowModel[keyof TRowModel]) => {
    props.handleChangeInput && props.handleChangeInput(value, props.index, props.fieldName);
  };

  const handleBlurInput = (value: TRowModel[keyof TRowModel], event: React.FocusEvent | React.KeyboardEvent) => {
    props.handleBlur(event, value, props.index, props.fieldName);
  };

  switch (props.editType) {
    case 'number':
      return (
        <OutlinedInput
          value={props.value || ''}
          onChange={(e) => {
            handle(parseInt(e.target.value) as TRowModel[keyof TRowModel]);
          }}
          inputRef={props.cellRef}
          name={props.fieldName.toString() + props.index}
          type="number"
          onBlur={(e) => {
            handleBlurInput(parseInt(props.value) as TRowModel[keyof TRowModel], e);
          }}
          onKeyDown={(e) =>
            e.key === 'Enter' && handleBlurInput(parseInt(props.value) as TRowModel[keyof TRowModel], e)
          }
        />
      );
    case 'time':
      return (
        <TimeField
          value={props.value}
          onChange={(e) => {
            handle(e.toISOString() as TRowModel[keyof TRowModel]);
          }}
          inputRef={props.cellRef}
          name={props.fieldName.toString() + props.index}
          onBlur={(e) => {
            handleBlurInput(dayjs(e.target.value, 'hh:mm A').toISOString() as TRowModel[keyof TRowModel], e);
          }}
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            handleBlurInput(dayjs(props.value, 'hh:mm A').toISOString() as TRowModel[keyof TRowModel], e)
          }
        />
      );
    case 'select':
      return props.selectOptions ? (
        <Select
          value={select}
          onChange={handleChange}
          inputRef={props.cellRef}
          onBlur={(e) => {
            handleBlurInput(e.target.value as TRowModel[keyof TRowModel], e);
          }}
        >
          {props.selectOptions.map((option: SelectOption) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      ) : (
        <></>
      );
    default:
      return <></>;
  }
}
