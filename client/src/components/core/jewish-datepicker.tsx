import * as React from 'react';
import { WEEK_DAYS } from '@/utils/AdapterHebDate';
import { HDate } from '@hebcal/core';
import { TextField, TextFieldProps } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

// Define the props for the JewishDatePicker component
interface JewishDatePickerProps extends Omit<DatePickerProps<Dayjs>, 'value' | 'onChange'> {
  selectedDate: Dayjs | null;
  label?: string;
  sx?: any;
  format?: string;
  onDateChange?: (newDate: Dayjs | null) => void;
}

// JewishDatePicker component
const JewishDatePicker: React.FC<JewishDatePickerProps> = ({
  selectedDate,
  label,
  sx,
  format = 'MMM D, YYYY',
  onDateChange,
  ...props
}) => {
  // Convert the selected date to a Hebrew date string
  const hebrewDate = React.useMemo(() => selectedDate ? new HDate(selectedDate.toDate()).renderGematriya() : '', [selectedDate]);

  // Handle date change event
  const handleDateChange = (newDate: Dayjs | null) => {
    onDateChange?.(newDate);
  };

  // Custom text field to display the Hebrew date
  const CustomTextField: React.FC<TextFieldProps> = (params) => (
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

  return (
    <DatePicker
      format={format}
      label={label}
      value={selectedDate || null}
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
        width: '100%',
        ...sx,
      }}
      {...props}
    />
  );
};

export default JewishDatePicker;
