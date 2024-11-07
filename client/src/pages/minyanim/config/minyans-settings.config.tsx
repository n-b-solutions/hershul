import { Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { MessageTab } from '@/types/message.type';
import { SelectOption } from '@/types/metadata.type';
import { tFieldMinyanTable } from '@/types/minyans.type';
import { Room } from '@/types/room.type';
import { ColumnDef } from '@/types/table.type';

import { MinyanType } from '../../../../../lib/types/minyan.type';
import { ActionsMessage } from '../components/minyans-settings/ActionsMessage';

const getFormatWithActionsMessage = (props: {
  value: number | string;
  roomName?: string;
  message?: MessageTab;
  id?: string;
  field?: tFieldMinyanTable;
  index?: number;
  disabledEdit?: boolean;
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
              disabledEdit={props?.disabledEdit ?? false}
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
  roomsOptionsArray: SelectOption<string>[];
}): ColumnDef<MinyanType>[] => [
  {
    formatter: (row, index, disabledEdit?: boolean): React.JSX.Element =>
      getFormatWithActionsMessage({
        value: row.blink?.secondsNum || '',
        roomName: row.room?.name,
        message: row.blink?.message,
        id: row?.id,
        field: 'blink',
        index,
        disabledEdit,
      }),
    valueForEdit: (row) => row.blink?.secondsNum,
    editInputType: 'number',
    name: 'Blink',
    field: 'blink',
    padding: 'none',
    align: 'center',
    tooltip: 'Time to start Blink before lights on',
  },
  {
    formatter: (row, index, disabledEdit?: boolean): React.JSX.Element =>
      getFormatWithActionsMessage({
        value: dayjs(row.startDate?.time).format('hh:mm A'),
        roomName: row.room?.name,
        message: row.startDate?.message,
        id: row?.id,
        field: 'startDate',
        index,
        disabledEdit,
      }),
    editInputType: 'time',
    padding: 'none',
    name: 'Start Time',
    field: 'startDate',
    align: 'center',
    tooltip: 'Lights On',
    valueForEdit: (row) => dayjs(row.startDate?.time),
  },
  {
    formatter: (row, index, disabledEdit?: boolean): React.JSX.Element =>
      getFormatWithActionsMessage({
        value: dayjs(row.endDate?.time).format('hh:mm A'),
        roomName: row.room?.name,
        message: row.endDate?.message,
        id: row?.id,
        field: 'endDate',
        index: index,
        disabledEdit,
      }),
    editInputType: 'time',
    padding: 'none',
    name: 'End Time',
    field: 'endDate',
    align: 'center',
    tooltip: 'Lights Off',
    valueForEdit: (row) => dayjs(row.endDate?.time),
  },
  {
    formatter: (row): React.JSX.Element => getFormatWithActionsMessage({ value: row.room?.name }),
    editInputType: 'select',
    valueForEdit: (row) => row.room?.id,
    selectOptions: roomsOptionsArray,
    valueOption: roomArray,
    padding: 'none',
    name: 'Room',
    field: 'room',
    align: 'center',
  },
];
