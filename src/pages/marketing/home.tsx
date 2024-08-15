import * as React from 'react';
import { Helmet } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';

import { Room } from '@/components/marketing/home/room';
import { ListMinyan } from '@/components/marketing/home/listMinyan';
import { Box, Grid } from '@mui/material';

const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

export function Page(): React.JSX.Element {
  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <main>
        <h2>{config.site.description}</h2>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Room />
            </Grid>
            <Grid item xs={6}>
                <ListMinyan />
            </Grid>
        </Grid>
      
      </main>
    </React.Fragment>
  );
}
