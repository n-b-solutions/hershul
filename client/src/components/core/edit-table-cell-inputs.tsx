import React, { Ref, useState } from 'react';
import { OutlinedInput, Select, SelectChangeEvent } from '@mui/material';

import { SelectOption } from '@/types/room';
import { Option } from '@/components/core/option';
import dayjs from 'dayjs';

export function EditTableCellInputs<TRowModel extends object>(props: {
  value: any;
  handleChangeInput: (value: TRowModel[keyof TRowModel], index: number, field: keyof TRowModel) => void;
  cellRef: Ref<any>;
  index: number;
  fieldName: keyof TRowModel;
  handleBlur: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    value?: TRowModel[keyof TRowModel],
    index?: number,
    fieldName?: keyof TRowModel
  ) => void;
  editType?: string;
  selectOptions?: SelectOption[];
  valueOption?: any & { id: string }[];
}): React.JSX.Element {
  
  const [select, setSelect] = useState((props.value?.value)&&(props.value.value));

  const handleChange = (event: SelectChangeEvent<any>) => {
    setSelect(event.target.value);
    const editValue = props.valueOption?.find((value: any) => value.id === event.target.value);
    props.handleChangeInput && props.handleChangeInput(editValue, props.index, props.fieldName);
  };

  const handle = (value: TRowModel[keyof TRowModel]) => {
    props.handleChangeInput && props.handleChangeInput(value, props.index, props.fieldName);
  };

  switch (props.editType) {
    case 'number':
      return (
        <OutlinedInput
          value={props.value||''}
          onChange={(e) => {
            handle(parseInt(e.target.value) as TRowModel[keyof TRowModel]);
          }}
          inputRef={props.cellRef}
          name={props.fieldName.toString() + props.index}
          type="number"
          onBlur={(e) => {
            props.handleBlur(e, parseInt(e.target.value) as TRowModel[keyof TRowModel], props.index, props.fieldName);
          }}
        />
      );
    case 'time':
      return (
        <OutlinedInput
          value={props.value}
          onChange={(e) => {
            handle(e.target.value as TRowModel[keyof TRowModel]);
          }}
          inputRef={props.cellRef}
          name={props.fieldName.toString() + props.index}
          type="time"
          onBlur={(e) => {
            props.handleBlur(e, dayjs(e.target.value).toDate() as TRowModel[keyof TRowModel], props.index, props.fieldName);
          }}
        />
      );
    case 'select':
      return props.selectOptions ? (
        <Select
          value={select}
          onChange={handleChange}
          inputRef={props.cellRef}
          onBlur={(e) => {
            props.handleBlur(e, e.target.value as TRowModel[keyof TRowModel], props.index, props.fieldName);
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
