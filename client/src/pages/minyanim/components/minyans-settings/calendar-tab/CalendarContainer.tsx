import React, { useEffect, useLayoutEffect, useState } from 'react';
import { setCurrentSelectedDate } from '@/redux/minyans/setting-times-slice';
import { Box, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch } from 'react-redux';

import JewishDatePicker from '@/components/core/jewish-datepicker';

import CalendarLuachMinyansTable from './CalendarLuachMinyansTable';
import CalendarMinyansTable from './CalendarMinyansTable';

interface CalendarContainerProps {
  scrollAction: { isScroll: boolean; setIsScroll: React.Dispatch<React.SetStateAction<boolean>> };
}

const CalendarContainer: React.FC<CalendarContainerProps> = ({ scrollAction }) => {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs());
  const [dateRefHeight, setDateRefHeight] = useState<number | null>(null);
  const dispatch = useDispatch();
  const dateRef = React.useRef<HTMLDivElement>(null);

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
      dispatch(setCurrentSelectedDate({ currentDate: newDate.toISOString() }));
    }
  };

  useLayoutEffect(() => {
    if (dateRef.current) {
      setDateRefHeight(dateRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (dateRef.current) {
        setDateRefHeight(dateRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Box ref={dateRef}>
        <JewishDatePicker
          label="Specific Date"
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          sx={{ paddingBottom: '2%', paddingLeft: '1%', width: '20%' }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          height: `calc(100% - ${dateRefHeight}px)`,
          flexDirection: 'row',
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '100%' }}>
          <CalendarMinyansTable selectedDate={selectedDate} scrollAction={scrollAction} />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '100%' }}>
          <CalendarLuachMinyansTable selectedDate={selectedDate} scrollAction={scrollAction} />
        </Box>
      </Box>
    </>
  );
};

export default CalendarContainer;
