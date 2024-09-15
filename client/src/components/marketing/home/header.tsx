import React, { useEffect, useState } from 'react';
import { Event, HDate, HebrewCalendar } from '@hebcal/core';
import { Grid, IconButton, Typography } from '@mui/material';
import { ArrowLeft as BackIcon, Gear as SettingsIcon } from '@phosphor-icons/react/dist/ssr';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';

function Header() {
  const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm:ss'));
  const [hebrewDate, setHebrewDate] = useState<string>(new HDate(new Date()).toString());
  const [specialDay, setSpecialDay] = useState<string>('');

  const location = useLocation();

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

    const intervalId = setInterval(updateDate, 1000); // Update every second
    return () => clearInterval(intervalId);
  }, []);

  const isHomePage = location.pathname === '/';
  console.log('Current Path:', location.pathname);
  console.log('Is Home Page:', isHomePage);

  return (
    <Grid container direction="row" alignItems="center" justifyContent="center" spacing={2}>
      
      
      <Grid item>
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
      </Grid>

      <Grid item>
        <Typography
          variant="body1"
          sx={{
            color: '#1a73e8',
          }}
        >
          {specialDay}
        </Typography>
        </Grid>
      <Grid item>
        <Typography variant="body2" color="textSecondary">
          {hebrewDate}
        </Typography>

        </Grid>
        <Grid item>
        <Typography variant="body1">
          {time}
        </Typography>
        
      </Grid>
      <Grid item>
        <IconButton color="secondary" size="small" href={isHomePage ? '/settings' : '/'}>
          {isHomePage ? <SettingsIcon /> : <BackIcon />}
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default Header;
