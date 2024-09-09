import * as React from 'react';
import { Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata';

import { TypeOfDateComponent } from './components/type-of-date/type-of-date';
import { ZmanimTable } from './components/zmanim-table';

const metadata: Metadata = { title: 'Setting' };

export function Page(): React.JSX.Element {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <Grid container rowSpacing={6} sx={{ width: '100%' }}>
        <Grid item xs={16}>
          <TypeOfDateComponent />
        </Grid>
        <Grid item xs={16}>
          <ZmanimTable />
        </Grid>
      </Grid>
    </>
  );
}
