import * as React from 'react';
import { CardActions, Grid, IconButton, Typography } from '@mui/material';
import { Gear as SettingsIcon } from '@phosphor-icons/react/dist/ssr/Gear';
import { Helmet } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata.type';
import { config } from '@/config';

import { Rooms } from './components/Rooms';
import { Schedule } from './components/Schedule';

const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

export function Home(): React.JSX.Element {
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
          height: '100%',
        }}
      >
        {/* TODO: check if this Grid is needed */}
        <Grid container></Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Rooms />
          </Grid>
          <Grid item xs={6}>
            <Schedule />
          </Grid>
        </Grid>
      </main>
    </React.Fragment>
  );
}
