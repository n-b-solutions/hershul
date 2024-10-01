import { TypeOfDate } from '@/types/minyanim';

import { eDateType } from '../../../bin/types/minyan.type';

export const enum eLocationClick {
  top = 'top',
  bottom = 'bottom',
}

export const GENERATE_TIME = 10;

export const enum eFieldName {
  room = 'room',
  endDate = 'endDate',
  startDate = 'startDate',
  blink = 'blink',
  roomId = 'roomId',
  endDateTime = 'endDate.time',
  startDateTime = 'startDate.time',
  blinkSecondsNum = 'blink.secondsNum',
  isEdited = 'isEdited',
}

export const SECONDS_NUM = 'secondsNum';
export const TIME = 'time';
export const MESSAGE_ID = 'messageId';
export const NO_DATA = 'No minyans have been determined for this category';

export const IMPORT_MINYANS = 'import minyans';

export const TITTLE_IMPORT_MINYAN_MODEL = 'Import minyan from another category';

export const WARRNING_IMPORT_MINYAN = (sumItem: number) =>
  `You are going to define ${sumItem} new minyans for this category`;

export const typesOfDates = [
  { value: eDateType.SUNDAY, label: 'Sunday & Tuesday & Wednesday' },
  { value: eDateType.MONDAY, label: 'Monday & Thursday' },
  { value: eDateType.FRIDAY, label: 'Friday' },
  { value: eDateType.SATURDAY, label: 'Saturday Night' },
  { value: eDateType.ROSH_HODESH, label: 'Rosh Hodesh' },
  { value: eDateType.DEFAULT, label: 'Calendar' },
] satisfies TypeOfDate[];

export const EMPTY_STRING = '';
