import React, { useEffect, useState } from 'react';
import { Event, HDate, HebrewCalendar } from '@hebcal/core';
import { Grid, Typography } from '@mui/material';
import { format } from 'date-fns';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';

function Header() {
  const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm:ss'));
  const [hebrewDate, setHebrewDate] = useState<string>(new HDate(new Date()).toString());
  const [specialDay, setSpecialDay] = useState<string>('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      setTime(format(now, 'HH:mm:ss'));
      const newHebrewDate = new HDate(now).toString();
      setHebrewDate(newHebrewDate);

      const events: Event[] = HebrewCalendar.getHolidaysOnDate(new HDate(now)) || [];
      setSpecialDay(events.length > 0 ? events[0].getDesc() : '');
    };

    updateDate(); 

    const intervalId = setInterval(updateDate, 1000 * 60);
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
