import { Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { MessageTab } from '@/types/message.type';
import {  MinyanDetails, tFieldMinyanTable } from '@/types/minyans.type';
import { Room } from '@/types/room.type';
import { ColumnDef } from '@/components/core/data-table';

import { ActionsMessage } from '../components/ActionsMessage';
import { SelectOption } from '@/types/metadata.type';

const getFormat = (props: {
  value: number | string;
  roomName?: string;
  message?: MessageTab;
  id?: string;
  field?: tFieldMinyanTable;
  index?: number;
}) => {
  return (
    <Grid container direction="row" justifyContent="center" spacing={2}>
      <Grid item>
        <Typography component="span" position="relative" sx={{ ...styleTypography }} variant="inherit">
          {props.value}
        </Typography>
      </Grid>
      {props.value && (
        <Grid item>
          {props.roomName && props.id && props.field && (
            <ActionsMessage
              field={props.field}
              roomName={props.roomName}
              message={props.message}
              minyanId={props.id}
              index={props?.index ?? 0}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
};

const styleTypography = {
  display: 'grid',
  justifyItems: 'center',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  height: '54px',
};

export const getMinyansSettingsColumns = ({
  roomArray,
  roomsOptionsArray,
}: {
  roomArray: Room[];
  roomsOptionsArray: SelectOption<string>[]
}) =>
  [
    {
      formatter: (row, index): React.JSX.Element =>
        getFormat({
          value: row.blink?.secondsNum || '',
          roomName: row.room?.nameRoom,
          message: row.blink?.message,
          id: row?.id,
          field: 'blink',
          index,
        }),
      valueForEdit: (row) => row.blink?.secondsNum,
      editInputType: 'number',
      name: 'Blink',
      width: '250px',
      field: 'blink',
      padding: 'none',
      align: 'center',
      tooltip: 'Time to start Blink before lights on',
    },
    {
      formatter: (row, index): React.JSX.Element =>
        getFormat({
          value: dayjs(row.startDate?.time).format('hh:mm A'),
          roomName: row.room?.nameRoom,
          message: row.startDate?.message,
          id: row?.id,
          field: 'startDate',
          index,
        }),
      editInputType: 'time',
      padding: 'none',
      name: 'Start Time',
      width: '250px',
      field: 'startDate',
      align: 'center',
      tooltip: 'Lights On',
      valueForEdit: (row) => dayjs(row.startDate?.time),
    },
    {
      formatter: (row, index): React.JSX.Element =>
        getFormat({
          value: dayjs(row.endDate?.time).format('hh:mm A'),
          roomName: row.room?.nameRoom,
          message: row.endDate?.message,
          id: row?.id,
          field: 'endDate',
          index: index,
        }),
      editInputType: 'time',
      padding: 'none',
      name: 'End Time',
      width: '250px',
      field: 'endDate',
      align: 'center',
      tooltip: 'Lights Off',
      valueForEdit: (row) => dayjs(row.endDate?.time),
    },
    {
      formatter: (row): React.JSX.Element => getFormat({ value: row.room?.nameRoom }),
      editInputType: 'select',
      valueForEdit: (row) => row.room?.id,
      selectOptions: roomsOptionsArray,
      valueOption: roomArray,
      padding: 'none',
      name: 'Room',
      width: '250px',
      field: 'room',
      align: 'center',
    },
  ] satisfies ColumnDef<MinyanDetails>[];
