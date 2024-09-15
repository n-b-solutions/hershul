import React, { useEffect, useState } from 'react';
import { Event, HDate, HebrewCalendar } from '@hebcal/core'; // יבוא מהספרייה של hebcal
import { Box, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';

function Header() {
  const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;
  const hebrewDate = new HDate(new Date()).renderGematriya();
  const today = new HDate(new Date());
  const events: Event[] = HebrewCalendar.getHolidaysOnDate(today) || [];
  const specialDay = events.length > 0 ? events[0].getDesc() : '';

  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm:ss'));
  useEffect(() => {
    const updateTime = () => {
      setTime(format(new Date(), 'HH:mm:ss'));
    };
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          fontFamily: 'Heebo, Arial',
          fontSize: '24px',
        }}
      >
        {metadata.description}
      </Typography>

      <Grid container alignItems="center" justifyContent="center" sx={{ flexGrow: 1 }}>
        <Typography
          variant="body1"
          sx={{
            marginRight: '8px',
            color: '#1a73e8',
          }}
        >
          {specialDay}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {hebrewDate}
        </Typography>
      </Grid>

      <Typography>{time}</Typography>
    </>
  );
}

export default Header;
