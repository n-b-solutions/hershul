import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import type { Metadata } from '@/types/metadata';
import { config } from '@/config';
import { RoomMatrix } from '@/components/marketing/home/roomMatrix';
import { ListMinyan } from '@/components/marketing/home/listMinyan';
import { Grid, Typography } from '@mui/material';

const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

export function Page(): React.JSX.Element {
  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection: 'column',height: '100vh' }}>
        <Typography>{metadata.description}</Typography>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <RoomMatrix />
            </Grid>
            <Grid item xs={6}>
                <ListMinyan />
            </Grid>
        </Grid>
      </main>
    </React.Fragment>
  );
}
