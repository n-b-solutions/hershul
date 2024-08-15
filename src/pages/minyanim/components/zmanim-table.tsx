'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';
import { LineItemTable } from '@/types/minyanim';


export function ZmanimTable(props: { columns: ColumnDef<LineItemTable>[], lineItems: LineItemTable[] }): React.JSX.Element {
  return (
    <Box sx={{ bgcolor: 'var(--mui-palette-background-level1)', p: 3 }}>
      <Card>
        <Divider />
        <Box sx={{ overflowX: 'auto' }}>
          <DataTable<LineItemTable> columns={props.columns} rows={props.lineItems} />
        </Box>
      </Card>
    </Box>
  );
}
