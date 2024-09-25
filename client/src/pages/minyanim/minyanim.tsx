import * as React from 'react';
import { Grid, Tab, Tabs } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata';
import { TypeOfDate } from '@/types/minyanim';

import { TypeOfDateComponent } from './components/type-of-date/type-of-date';
import { ZmanimTable } from './components/zmanim-table';

const metadata: Metadata = { title: 'Setting' };

const typesOfDates = [
  { value: 'sunday', label: 'Sunday & Tuesday & Wednesday' },
  { value: 'monday', label: 'Monday & Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday Night' },
  { value: 'roshHodesh', label: 'Rosh Hodesh' },
  { value: 'calendar', label: 'Calendar' },
] satisfies TypeOfDate[];

export function Page(): React.JSX.Element {
  const [valueType, setValueType] = React.useState<string>(typesOfDates[0].value);

  const handleTypeChange = (_: React.SyntheticEvent, value: string) => {
    setValueType(value);
  };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <Grid container sx={{ width: '100%', height: '90vh' }}>
        {' '}
        <Grid item xs={12}>
          <Tabs onChange={handleTypeChange} sx={{ px: 3 }} value={valueType} variant="scrollable">
            {typesOfDates.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Grid>
        <Grid item xs={12} sx={{ height: 'calc(100% - 48px)', overflowY: 'auto' }}>
          {' '}
          <ZmanimTable typeDate={valueType} />
        </Grid>
      </Grid>
    </>
  );
}
