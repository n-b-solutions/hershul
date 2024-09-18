import React, { useEffect, useState } from 'react';
import { Event, HDate, HebrewCalendar } from '@hebcal/core';
import { Grid, IconButton, Typography } from '@mui/material';
import { ArrowLeft as BackIcon, ArrowRight as ForwardIcon, Gear as SettingsIcon } from '@phosphor-icons/react/dist/ssr';
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';

function Header() {
  const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm:ss'));
  const [hebrewDate, setHebrewDate] = useState<string>(new HDate(new Date()).toString());
  const [specialDay, setSpecialDay] = useState<string>('');

  const location = useLocation();
  const navigate = useNavigate();

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

  const handleNavigation = () => {
    if (isHomePage) {
      navigate('/setting');
    } else {
      navigate('/');
    }
  };

  return (
    <Grid container direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{
      borderBottom: '2px solid #000', 
      paddingBottom: '8px', 
      paddingLeft: '16px', 
    }}>
      <Grid item xs={6}>
        <Typography variant="h6">
          {metadata.description}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Grid container direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
          <Grid item>
            <Typography variant="body1" sx={{ color: '#1a73e8' }}>
              {specialDay}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="body2" color="textSecondary">
              {hebrewDate}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="body1">{time}</Typography>
          </Grid>

          <Grid item>
            <IconButton color="secondary" size="small" onClick={handleNavigation}>
              {isHomePage ? <SettingsIcon /> : <ForwardIcon />}
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Header;
