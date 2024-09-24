import * as React from 'react';
import { CardActions, Grid, IconButton, Typography } from '@mui/material';
import { Gear as SettingsIcon } from '@phosphor-icons/react/dist/ssr/Gear';
import { Helmet } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata';
import { config } from '@/config';
import Header from '@/components/marketing/home/header';
import { ListMinyan } from '@/components/marketing/home/listMinyan';
import { RoomMatrix } from '@/components/marketing/home/roomMatrix';

const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

export function Page(): React.JSX.Element {
  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '90vh',
        }}
      >
        <Grid container></Grid>
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
