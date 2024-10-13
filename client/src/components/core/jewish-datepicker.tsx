import * as React from 'react';
import { WEEK_DAYS } from '@/utils/AdapterHebDate';
import { HDate } from '@hebcal/core';
import { TextField, TextFieldProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

interface JewishDatePickerProps {
  selectedDate: Dayjs;
  setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  label?: string;
  sx?: any;
  format?: string;
}

const JewishDatePicker: React.FC<JewishDatePickerProps> = ({
  selectedDate,
  setSelectedDate,
  label,
  sx,
  format = 'MMM D, YYYY',
}) => {
  const hebrewDate = new HDate(selectedDate.toDate()).renderGematriya();

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
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
      sx={sx}
    />
  );
};

export default JewishDatePicker;
