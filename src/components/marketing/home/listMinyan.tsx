'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { dayjs } from '@/lib/dayjs';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';
import { SpeakerSimpleHigh as SpeakerIcon } from '@phosphor-icons/react/dist/ssr/SpeakerSimpleHigh';
import { Divider, Tooltip } from '@mui/material';
import { SystemMessages } from './systemMessages';

interface Minyan {
    room: string;
    messages: string;
    announcement: boolean;
    startDate: Date;
}

const minyans = [
    {
        room: 'room1',
        announcement: true,
        messages: "room1",
        startDate: dayjs().subtract(23, 'second').subtract(32, 'minute').toDate(),
    },
    {
        room: 'room2',
        announcement: false,
        messages: "room2",
        startDate: dayjs().subtract(51, 'second').subtract(36, 'minute').toDate(),
    },
    {
        room: 'room3',
        messages: "room3",
        announcement: true,
        startDate: dayjs().subtract(55, 'second').subtract(38, 'minute').toDate(),
    },
    {
        room: 'room3',
        messages: "room3",
        announcement: true,
        startDate: dayjs().subtract(3, 'second').subtract(40, 'minute').toDate(),
    },
    {
        room: 'room3',
        messages: "room3",
        announcement: false,
        startDate: dayjs().subtract(32, 'second').subtract(45, 'minute').toDate(),
    },
    {
        room: 'room1',
        announcement: true,
        messages: "room1",
        startDate: dayjs().subtract(23, 'second').subtract(32, 'minute').toDate(),
    },
    {
        room: 'room2',
        announcement: false,
        messages: "room2",
        startDate: dayjs().subtract(51, 'second').subtract(36, 'minute').toDate(),
    },
    {
        room: 'room3',
        messages: "room3",
        announcement: true,
        startDate: dayjs().subtract(55, 'second').subtract(38, 'minute').toDate(),
    },
    {
        room: 'room3',
        messages: "room3",
        announcement: true,
        startDate: dayjs().subtract(3, 'second').subtract(40, 'minute').toDate(),
    },
    {
        room: 'room3',
        messages: "room3",
        announcement: false,
        startDate: dayjs().subtract(32, 'second').subtract(45, 'minute').toDate(),
    },
] satisfies Minyan[];



export function ListMinyan(): React.JSX.Element {
    const columns = [
        {
            formatter: (row): React.JSX.Element => (
                <div>
                    <Typography color="text.secondary" suppressHydrationWarning sx={{ whiteSpace: 'nowrap' }} variant="body2">
                        {dayjs(row.startDate).format(' hh:mm A')}
                    </Typography>
                </div>
            ),
            name: 'Start time',
            width: '70px',
        },
        {
            formatter: (row): React.JSX.Element => (
                <div>
                    <Typography sx={{ whiteSpace: 'nowrap' }} variant="subtitle2">
                        {row.room}
                    </Typography>
                </div>
            ),
            name: 'Room',
            width: '70px',
        },
    
        {
            formatter: (row): React.JSX.Element => {
                return <>
                    {row.announcement ? <Tooltip title={row.messages}>
                        <IconButton onClick={() => handleMessageClick()}>
                            <SpeakerIcon />
                        </IconButton>
                    </Tooltip> : null}
                </>;
            },
            name: 'Status',
            width: '70px',
        },
    ] satisfies ColumnDef<Minyan>[];
    const [displayMessage, setDisplayMessage] = React.useState<boolean>(false)
    const handleMessageClick = () => {
        setDisplayMessage(true)
    }
    const handleCloseMessage = () => {
        setDisplayMessage(false)
      }
    return (
        <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', p: 3 }}>
            <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <CardHeader title="Next Minyans" />
                <Divider />
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <DataTable<Minyan> columns={columns} rows={minyans} />
                </Box>
                <SystemMessages open={displayMessage} handleClose={handleCloseMessage}/>
            </Card>
        </Box>
    );
}
