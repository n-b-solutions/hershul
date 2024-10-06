import * as React from 'react';
import { typesOfDates } from '@/const/minyans.const';
import { setCurrentDateType } from '@/redux/minyans/setting-times-slice';
import { RootState } from '@/redux/store';
import { Grid, Tab, Tabs } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import type { Metadata } from '@/types/metadata.type';

import { eDateType } from '../../../../lib/types/minyan.type';
import { MinyansSettings } from './components/MinyansSettings';

const metadata: Metadata = { title: 'Setting' };

export const Settings = (): React.JSX.Element => {
  const currentType = useSelector((state: RootState) => state.minyans.dateType);
  const dispatch = useDispatch();
  const handleTypeChange = (_: React.SyntheticEvent, value: eDateType) => {
    dispatch(setCurrentDateType({ currentType: value }));
  };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <Grid container sx={{ width: '100%', height: '100%' }}>
        <Grid item xs={12}>
          <Tabs onChange={handleTypeChange} sx={{ px: 3 }} value={currentType} variant="scrollable">
            {typesOfDates.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Grid>
        <Grid item xs={12} sx={{ height: 'calc(100% - 48px)', overflowY: 'auto' }}>
          <MinyansSettings dateType={currentType} />
        </Grid>
      </Grid>
    </>
  );
};
