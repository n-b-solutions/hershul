import React, { Ref, useState } from 'react';
import { OutlinedInput, Select, SelectChangeEvent, Switch, TextField } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import dayjs from 'dayjs';

import { SelectOption } from '@/types/metadata.type';
import { Option } from '@/components/core/option';

export function EditTableCellInputs<TRowModel extends object, TEdit = any>(props: {
  value: any;
  handleChangeInput: (value: TEdit) => void;
  cellRef: Ref<any>;
  index: number;
  fieldName: keyof TRowModel;
  handleBlur: (event: React.FocusEvent | React.KeyboardEvent, value?: TEdit) => void;
  editType?: string;
  selectOptions?: SelectOption<string>[];
  valueOption?: any & { id: string }[];
}): React.JSX.Element {
  const [select, setSelect] = useState(props.value);
  const handleChange = (event: SelectChangeEvent<any>) => {
    setSelect(event.target.value);
    const editValue = props.valueOption?.find((value: any) => value.id === event.target.value) || event.target.value;
    props.handleChangeInput && props.handleChangeInput(editValue);
  };

  const handle = (value: TEdit) => {
    props.handleChangeInput && props.handleChangeInput(value);
  };

  const handleBlurInput = (value: TEdit, event: React.FocusEvent | React.KeyboardEvent) => {
    props.handleBlur(event, value);
  };

  switch (props.editType) {
    case 'number':
      return (
        <OutlinedInput
          value={props.value || ''}
          onChange={(e) => {
            handle(parseInt(e.target.value) as TEdit);
          }}
          inputRef={props.cellRef}
          name={props.fieldName.toString() + props.index}
          type="number"
          onBlur={(e) => {
            handleBlurInput(parseInt(props.value) as TEdit, e);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleBlurInput(parseInt(props.value) as TEdit, e)}
        />
      );
    case 'time':
      return (
        <TimeField
          value={props.value}
          onChange={(e) => {
            handle(e.toISOString() as TEdit);
          }}
          inputRef={props.cellRef}
          name={props.fieldName.toString() + props.index}
          onBlur={(e) => {
            handleBlurInput(dayjs(e.target.value, 'hh:mm A').toISOString() as TEdit, e);
          }}
          onKeyDown={(e) =>
            e.key === 'Enter' && handleBlurInput(dayjs(props.value, 'hh:mm A').toISOString() as TEdit, e)
          }
        />
      );
    case 'select':
      return props.selectOptions ? (
        <Select
          value={select}
          sx={{ width: '70%' }}
          onChange={handleChange}
          inputRef={props.cellRef}
          onBlur={(e) => {
            handleBlurInput(e.target.value as TEdit, e);
          }}
          onKeyDownCapture={(e) => {
            e.key === 'Enter' && handleBlurInput(props.value as TEdit, e);
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
            handle(e.target.checked as TRowModel[keyof TRowModel] as TEdit);
          }}
          onBlur={(e) => {
            handleBlurInput(isChecked as TEdit, e);
          }}
          onKeyDownCapture={(e) => {
            e.key === 'Enter' && handleBlurInput(isChecked as TEdit, e);
          }}
        />
      );

    default:
      return <></>;
  }
}
