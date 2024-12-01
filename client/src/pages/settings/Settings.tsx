import * as React from 'react';
import { typesOfDates } from '@/const/minyans.const';
import { setCurrentDateType } from '@/redux/minyans/setting-times-slice';
import { RootState } from '@/redux/store';
import { Grid, Tab, Tabs } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata.type';

import { MinyansSettings } from './components/minyans-settings/MinyansSettings';

const metadata: Metadata = { title: 'Setting' };

export const Settings = (): React.JSX.Element => {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <Grid container sx={{ width: '100%', height: '100%' }}>
        <Grid item xs={12} sx={{ height: '100%' }}>
          <MinyansSettings />
        </Grid>
      </Grid>
    </>
  );
};
