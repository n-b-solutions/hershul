import { Grid, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { tFieldLuachMinyanTable } from '@/types/luach-minyan.type';
import { MessageTab } from '@/types/message.type';
import { SelectOption } from '@/types/metadata.type';
import { tFieldMinyanTable } from '@/types/minyans.type';
import { Room } from '@/types/room.type';
import { ColumnDef } from '@/types/table.type';

import { eJewishTimeOfDay, eRelativeTime, LuachMinyanType } from '../../../../../lib/types/luach-minyan.type';
import { eMinyanType, MinyanType } from '../../../../../lib/types/minyan.type';
import { ActionsMessage } from '../components/minyans-settings/ActionsMessage';

const getFormatWithActionsMessage = (props: {
  value: number | string;
  roomName?: string;
  message?: MessageTab;
  id?: string;
  field: tFieldMinyanTable | tFieldLuachMinyanTable;
  index?: number;
  disabledEdit?: boolean;
  blockType?: eMinyanType;
}) => {
  return (
    <Grid container direction="row" justifyContent="center" spacing={2}>
      <Grid item>
        <Tooltip title={props.value}>
          <Typography
            component="span"
            position="relative"
            sx={{
              ...styleTypography,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: '30px',
              width: '60px',
              maxWidth: '60px',
            }}
            variant="inherit"
          >
            {props.value}
          </Typography>
        </Tooltip>
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
              blockType={props.blockType}
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
        value: dayjs(row.startDate?.time).format('hh:mm A'),
        roomName: row.room?.name,
        message: row.startDate?.message,
        id: row?.id,
        field: 'startDate',
        index,
        disabledEdit,
        blockType: eMinyanType.minyan,
      }),
    editInputType: 'time',
    padding: 'none',
    name: 'Start Time',
    field: 'startDate',
    internalField: 'time',
    align: 'center',
    tooltip: 'Lights On',
    valueForEdit: (row) => dayjs(row.startDate?.time),
  },
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
        blockType: eMinyanType.minyan,
      }),
    editInputType: 'number',
    padding: 'none',
    name: 'Blink',
    field: 'blink',
    internalField: 'secondsNum',
    align: 'center',
    tooltip: 'Number of seconds to blink before turning off',
    valueForEdit: (row) => row.blink?.secondsNum,
  },
  {
    formatter: (row, index, disabledEdit?: boolean): React.JSX.Element =>
      getFormatWithActionsMessage({
        value: dayjs(row.endDate?.time).format('hh:mm A'),
        roomName: row.room?.name,
        message: row.endDate?.message,
        id: row?.id,
        field: 'endDate',
        index,
        disabledEdit,
        blockType: eMinyanType.minyan,
      }),
    editInputType: 'time',
    padding: 'none',
    name: 'End Time',
    field: 'endDate',
    internalField: 'time',
    align: 'center',
    tooltip: 'Lights Off',
    valueForEdit: (row) => dayjs(row.endDate?.time),
  },
  {
    formatter: (row): string => row.room?.name || '',
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

export const getLuachMinyansSettingsColumns = ({
  roomArray,
  roomsOptionsArray,
}: {
  roomArray: Room[];
  roomsOptionsArray: SelectOption<string>[];
}): ColumnDef<LuachMinyanType>[] => [
  {
    formatter: (row, index, disabledEdit?: boolean): React.JSX.Element =>
      getFormatWithActionsMessage({
        value: eJewishTimeOfDay[row.timeOfDay?.value],
        roomName: row.room?.name,
        message: row.timeOfDay?.message,
        id: row?.id,
        field: 'timeOfDay',
        index,
        disabledEdit,
        blockType: eMinyanType.luachMinyan,
      }),
    editInputType: 'select',
    selectOptions: Object.entries(eJewishTimeOfDay).map(([key, value]) => ({ value: key, label: value })),
    valueOption: Object.keys(eJewishTimeOfDay),
    valueForEdit: (row) => row.timeOfDay.value,
    name: 'Time of Day',
    field: 'timeOfDay',
    internalField: 'value',
    editable: true,
    padding: 'none',
    tooltip: 'Turn on the light at the time of day',
  },
  {
    formatter: (row): string => eRelativeTime[row.relativeTime] || '',
    editInputType: 'select',
    selectOptions: Object.entries(eRelativeTime).map(([key, value]) => ({ value: key, label: value })),
    valueOption: Object.keys(eRelativeTime),
    name: 'Relative Time',
    field: 'relativeTime',
    editable: true,
    padding: 'none',
    tooltip: 'Relative time to turn on the light',
  },
  {
    formatter: (row): string => row.relativeTimeDetail?.toString() || '',
    editInputType: 'number',
    valueForEdit: (row) => row.relativeTimeDetail,
    name: 'Relative Time Detail',
    field: 'relativeTimeDetail',
    editable: true,
    padding: 'none',
    tooltip: 'Indicates how many minutes before or after the time of day the minyan should start.',
  },
  {
    formatter: (row, index, disabledEdit?: boolean): React.JSX.Element =>
      getFormatWithActionsMessage({
        value: row.blink?.secondsNum?.toString() || '',
        roomName: row.room?.name,
        message: row.blink?.message,
        id: row?.id,
        field: 'blink',
        index,
        disabledEdit,
        blockType: eMinyanType.luachMinyan,
      }),
    editInputType: 'number',
    valueForEdit: (row) => row.blink?.secondsNum,
    name: 'Blink',
    field: 'blink',
    internalField: 'secondsNum',
    editable: true,
    padding: 'none',
    tooltip: 'Number of seconds to blink before turning off',
  },
  {
    formatter: (row, index, disabledEdit?: boolean): React.JSX.Element =>
      getFormatWithActionsMessage({
        value: row.duration?.value?.toString() || '',
        roomName: row.room?.name,
        message: row.duration?.message,
        id: row?.id,
        field: 'duration',
        index,
        disabledEdit,
        blockType: eMinyanType.luachMinyan,
      }),
    valueForEdit: (row) => row.duration?.value,
    editInputType: 'number',
    name: 'Duration',
    field: 'duration',
    internalField: 'value',
    editable: true,
    padding: 'none',
    tooltip: 'Total duration the light will be on (in minutes)',
  },
  {
    formatter: (row): string => row.room?.name || '',
    editInputType: 'select',
    valueForEdit: (row) => row.room?.id,
    selectOptions: roomsOptionsArray,
    valueOption: roomArray,
    name: 'Room',
    field: 'room',
    align: 'center',
    padding: 'none',
  },
];
