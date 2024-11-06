import { MinyanType } from './minyan.type';
import { eBulbColor, eBulbStatus } from './room.type';

export interface BulbStatusUpdate {
  roomId: string;
  bulbStatus: eBulbStatus;
  bulbColor: eBulbColor;
}

export interface MinyanUpdated {
  minyanId: string;
  updatedMinyans: MinyanType[];
}

export interface ScheduleAction {
  action: string;
  time: Date;
  roomName: string;
  message?: string;
}

export interface SocketEvents {
  'bulbStatusUpdated': BulbStatusUpdate;
  'minyanUpdated': MinyanUpdated;
  'scheduleAction': ScheduleAction;
}

export type SocketEventNames = keyof SocketEvents;

export interface SocketEventPayloads {
  [eventName: string]: any;
}

export const socketEventPayloads: SocketEventPayloads = {
  'bulbStatusUpdated': {
    roomId: '',
    bulbStatus: eBulbStatus.off,
    bulbColor: eBulbColor.white,
  },
  'minyanUpdated': {
    minyanId: '',
    updatedMinyans: [],
  },
  'scheduleAction': {
    action: '',
    time: new Date(),
    roomName: '',
    message: '',
  },
};