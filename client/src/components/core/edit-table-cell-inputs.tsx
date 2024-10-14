import React, { Ref, useState } from 'react';
import { SECONDS_NUM, TIME } from '@/const/minyans.const';
import { OutlinedInput, Select, SelectChangeEvent, Switch, TextField } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import dayjs from 'dayjs';

import { SelectOption } from '@/types/metadata.type';
import { typeForEdit } from '@/types/minyans.type';
import { Option } from '@/components/core/option';

export function EditTableCellInputs<TRowModel extends object>(props: {
  value: any;
  handleChangeInput: (value: typeForEdit, index: number, field: keyof TRowModel, internalField?: string) => void;
  cellRef: Ref<any>;
  index: number;
  fieldName: keyof TRowModel;
  handleBlur: (
    event: React.FocusEvent | React.KeyboardEvent,
    value?: typeForEdit,
    index?: number,
    fieldName?: keyof TRowModel,
    internalField?: string
  ) => void;
  editType?: string;
  selectOptions?: SelectOption<string>[];
  valueOption?: any & { id: string }[];
}): React.JSX.Element {
  const [select, setSelect] = useState(props.value);
  const handleChange = (event: SelectChangeEvent<any>) => {
    setSelect(event.target.value);
    const editValue = props.valueOption?.find((value: any) => value.id === event.target.value);
    props.handleChangeInput && props.handleChangeInput(editValue, props.index, props.fieldName);
  };

  const handle = (value: typeForEdit, internalField?: string) => {
    props.handleChangeInput && props.handleChangeInput(value, props.index, props.fieldName, internalField);
  };

  const handleBlurInput = (
    value: typeForEdit,
    event: React.FocusEvent | React.KeyboardEvent,
    internalField?: string
  ) => {
    props.handleBlur(event, value, props.index, props.fieldName, internalField);
  };

  switch (props.editType) {
    case 'number':
      return (
        <OutlinedInput
          value={props.value || ''}
          onChange={(e) => {
            handle(parseInt(e.target.value) as typeForEdit, SECONDS_NUM);
          }}
          inputRef={props.cellRef}
          name={props.fieldName.toString() + props.index}
          type="number"
          onBlur={(e) => {
            handleBlurInput(parseInt(props.value) as typeForEdit, e, SECONDS_NUM);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleBlurInput(parseInt(props.value) as typeForEdit, e, SECONDS_NUM)}
        />
      );
    case 'time':
      return (
        <TimeField
          value={props.value}
          onChange={(e) => {
            handle(e.toISOString() as typeForEdit, TIME);
          }}
          inputRef={props.cellRef}
          name={props.fieldName.toString() + props.index}
          onBlur={(e) => {
            handleBlurInput(dayjs(e.target.value, 'hh:mm A').toISOString() as typeForEdit, e, TIME);
          }}
          onKeyDown={(e) =>
            e.key === 'Enter' && handleBlurInput(dayjs(props.value, 'hh:mm A').toISOString() as typeForEdit, e, TIME)
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
            handleBlurInput(e.target.value as typeForEdit, e);
          }}
          onKeyDownCapture={(e) => {
            e.key === 'Enter' && handleBlurInput(props.value as typeForEdit, e);
          }}
        >
          {props.selectOptions.map((option: SelectOption<string>) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      ) : (
        <></>
      );
    case 'switch':
      const [isChecked, setIsChecked] = useState(!!props.value);

      React.useEffect(() => {
        setIsChecked(!!props.value);
      }, [props.value]);

      return (
        <Switch
          checked={isChecked}
          inputRef={props.cellRef}
          onChange={(e) => {
            setIsChecked(e.target.checked);
            handle(e.target.checked as TRowModel[keyof TRowModel] as typeForEdit);
          }}
          onBlur={(e) => {
            handleBlurInput(props.value as TRowModel[keyof TRowModel] as typeForEdit, e);
          }}
          onKeyDownCapture={(e) => {
            e.key === 'Enter' && handleBlurInput(props.value as typeForEdit, e);
          }}
        />
      );

    default:
      return <></>;
  }
}
