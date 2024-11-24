import { LuachMinyanType } from '../../../lib/types/luach-minyan.type';

export type tFieldLuachMinyanTable = 'timeOfDay' | 'relativeTime' | 'blink' | 'duration' | 'room';

export interface LuachMinyanRowType extends LuachMinyanType {
  isEdited?: boolean;
}

export interface LuachCalendarRowType extends LuachMinyanRowType {
  isRoutine?: boolean;
}
