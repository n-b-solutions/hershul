import * as React from 'react';
import { WEEK_DAYS } from '@/utils/AdapterHebDate';
import { HDate } from '@hebcal/core';
import { TextField, TextFieldProps } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

interface JewishDatePickerProps extends Omit<DatePickerProps<Dayjs>, 'value' | 'onChange'> {
  selectedDate: Dayjs | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  label?: string;
  sx?: any;
  format?: string;
  disabled?: boolean;
  onDateChange?: (newDate: Dayjs | null) => void;
}

const JewishDatePicker: React.FC<JewishDatePickerProps> = ({
  selectedDate,
  setSelectedDate,
  label,
  sx,
  format = 'MMM D, YYYY',
  disabled = false,
  onDateChange,
  ...props
}) => {
  const hebrewDate = new HDate(selectedDate?.toDate()).renderGematriya();

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  function CustomTextField(params: TextFieldProps) {
    return (
      <TextField
        size="small"
        {...params}
        value={hebrewDate}
        InputProps={{
          ...params.InputProps,
          readOnly: true,
        }}
      />
    );
  }

  return (
    <DatePicker
      disabled={disabled}
      format={format}
      label={label}
      value={selectedDate}
      minDate={dayjs()}
      onChange={handleDateChange}
      dayOfWeekFormatter={(date, dayJs: Dayjs) => WEEK_DAYS[dayJs.day()]}
      slotProps={{
        layout: {
          sx: {
            '.MuiDayCalendar-root': {
              direction: 'rtl',
            },
          },
        },
      }}
      slots={{ textField: CustomTextField }}
      sx={{
        ...sx,
        '& .MuiButtonBase-root': {
          height: '20px',
        },
      }}
      {...props}
    />
  );
};

export default JewishDatePicker;
