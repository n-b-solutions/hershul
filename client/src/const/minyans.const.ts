import { TypeOfDate } from '@/types/minyans.type';

import { eDateType } from '../../../lib/types/minyan.type';

export const GENERATE_TIME = 10;

//#region TODO: As to be removed, use keyof instead
export const SECONDS_NUM = 'secondsNum';
export const TIME = 'time';
export const MESSAGE_ID = 'messageId';
//#endregion TODO: As to be removed, use keyof instead

export const NO_DATA = 'No minyans have been determined for this category';

export const IMPORT_MINYANS = 'import minyans';

export const TITTLE_IMPORT_MINYAN_MODEL = 'Import minyan from another category';

export const WARNING_IMPORT_MINYAN = (sumItem: number) =>
  `You are going to define ${sumItem} new minyans for this category`;

export const typesOfDates = [
  { value: eDateType.sunday, label: 'Sunday & Tuesday & Wednesday' },
  { value: eDateType.monday, label: 'Monday & Thursday' },
  { value: eDateType.friday, label: 'Friday' },
  { value: eDateType.saturday, label: 'Saturday Night' },
  { value: eDateType.roshHodesh, label: 'Rosh Hodesh' },
  { value: eDateType.calendar, label: 'Calendar' },
] satisfies TypeOfDate[];

export const EMPTY_STRING = '';
