import { LuachMinyanType } from '../../../lib/types/luach-minyan.type';

export enum eFieldLuachMinyanTable {
  timeOfDay = 'timeOfDay',
  relativeTime = 'relativeTime',
  blink = 'blink',
  duration = 'duration',
  room = 'room',
}

export type tFieldLuachMinyanTable = keyof typeof eFieldLuachMinyanTable;

export interface LuachMinyanRowType extends LuachMinyanType {
  isEdited?: boolean;
}

export interface LuachCalendarRowType extends LuachMinyanRowType {
  isRoutine?: boolean;
}
