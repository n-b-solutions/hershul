import React from 'react';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
// import Clock from 'react-live-clock';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';
import Moment from 'react-moment';

function Header() {
  const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

  const holiday = 'Erev Rosh Hashana'; // You can change this dynamically
  const hebrewDate = 'Wed, 29th of Elul, 5784'; // Dynamic Hebrew date
  const time = format(new Date(), 'HH:mm:ss'); // Dynamic time

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
          {holiday}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {hebrewDate}
        </Typography>
      </Grid>

      <Typography>
      {/* <Clock format={'HH:mm:ss'} ticking={true} timezone={'US/Pacific'} /> */}
      {/* <Moment format="HH:mm:ss" interval={1000} /> */}
      </Typography>

    </>
  );
}

export default Header;
