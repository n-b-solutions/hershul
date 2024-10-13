import { MinyanType } from '../../../lib/types/minyan.type';

// TODO: Remove duplicate types & Rename types

export type tFieldMinyanTable = 'blink' | 'startDate' | 'endDate' | 'room';

export interface MinyanRowType extends MinyanType {
  isEdited?: boolean;
}

export interface CalendarRowType extends MinyanRowType {
  isRoutine?: boolean;
}

export interface ScheduleActionType {
  minyanId: string;
  roomName: string;
  time: Date;
  action: string;
  message?: string;
}
