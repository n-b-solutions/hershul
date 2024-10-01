import * as React from 'react';
import { typesOfDates } from '@/consts/setting-minyans';
import { setCurrentDateType } from '@/state/setting-times/setting-times-slice';
import { RootState } from '@/state/store';
import { Grid, Tab, Tabs } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import type { Metadata } from '@/types/metadata';
import { TypeOfDate } from '@/types/minyanim';

import { eDateType } from '../../../../bin/types/minyan.type';
import { TypeOfDateComponent } from './components/type-of-date/type-of-date';
import { ZmanimTable } from './components/zmanim-table';

const metadata: Metadata = { title: 'Setting' };

export function Page(): React.JSX.Element {
  const currentType = useSelector((state: RootState) => state.settingTimes.dateType);
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
          <ZmanimTable dateType={currentType} />
        </Grid>
      </Grid>
    </>
  );
}
