import * as React from 'react';
import { Helmet } from 'react-helmet-async';

import type { Metadata } from '@/types/metadata';
import { TypeOfdate } from './components/type-of-date/type-of-date';
import { Box, Typography } from '@mui/material';
import { ZmanimTable } from './components/zmanim-table';
import { ColumnDef } from '@/components/core/data-table';
import { LineItemTable } from '@/types/minyanim';

const metadata: Metadata = { title: 'Minyanim' };

const lineItems =
  [
    { id: '0', blink: '3', startTime: 1, endTime: 2, room: 1 },
    { id: '1', blink: '_', startTime: 1, endTime: 2, room: 5 }
  ] satisfies LineItemTable[]
  ;
const columns = [
  {
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: 'nowrap' }} variant="inherit">
        {row.blink}
      </Typography>
    ),
    name: 'Blink',
    width: '250px',
  },
  {
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: 'nowrap' }} variant="inherit">
        {row.startTime}
      </Typography>
    ),
    name: 'Start Time',
    width: '250px',
  },
  {
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: 'nowrap' }} variant="inherit">
        {row.endTime}
      </Typography>
    ),
    name: 'End Time',
    width: '250px',
  },
  {
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: 'nowrap' }} variant="inherit">
        {row.room}
      </Typography>
    ),
    name: 'Room',
    width: '250px',
  }

] satisfies ColumnDef<LineItemTable>[];

export function Page(): React.JSX.Element {


  return (
    <React.Fragment>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <Box sx={{ width: '100%' }}>
        <TypeOfdate></TypeOfdate>
        <ZmanimTable columns={columns} lineItems={lineItems}></ZmanimTable>
      </Box>
    </React.Fragment>
  );
}
