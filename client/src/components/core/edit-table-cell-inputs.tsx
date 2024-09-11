import React, { Ref, useState } from 'react';
import { OutlinedInput, Select, SelectChangeEvent } from '@mui/material';

import { SelectOption } from '@/types/room';
import { Option } from '@/components/core/option';

export function EditTableCellInputs<TRowModel extends object>(props: {
  value: any;
  handleChangeInput: (value: TRowModel[keyof TRowModel], index: number, field: keyof TRowModel) => void;
  cellRef: Ref<any>;
  index: number;
  fieldName: keyof TRowModel;
  onBlurInput: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
  editType?: string;
  selectOptions?: SelectOption[];
  valueOption?: any & { id: string }[];
}): React.JSX.Element {
  const [select, setSelect] = useState(props.value.value);

  const handleChange = (event: SelectChangeEvent<any>) => {
    setSelect(event.target.value);
    const editValue = props.valueOption?.find((value: any) => value.id === event.target.value);
    props.handleChangeInput && props.handleChangeInput(editValue, props.index, props.fieldName);
  };

  switch (props.editType) {
    case 'number':
      return (
        <OutlinedInput
          value={props.value}
          onChange={(e) => {
            props.handleChangeInput &&
              props.handleChangeInput(e.target.value as TRowModel[keyof TRowModel], props.index, props.fieldName);
          }}
          inputRef={props.cellRef}
          name={props.fieldName.toString() + props.index}
          type="number"
          onBlur={(e) => {
            props.onBlurInput(e);
          }}
        />
      );
    case 'time':
      return (
        <OutlinedInput
          value={props.value}
          onChange={(e) => {
            props.handleChangeInput &&
              props.handleChangeInput(e.target.value as TRowModel[keyof TRowModel], props.index, props.fieldName);
          }}
          inputRef={props.cellRef}
          name={props.fieldName.toString() + props.index}
          type="time"
          onBlur={(e) => {
            props.onBlurInput(e);
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
            props.onBlurInput(e);
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
