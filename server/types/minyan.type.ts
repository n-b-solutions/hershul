import { ObjectId } from "mongodb";

import { eDateType, SpecificDateType } from "../../lib/types/minyan.type";

export interface AlertTypeDocument {
  time: Date;
  messageId?: ObjectId;
}
export interface BlinkAlertTypeDocument {
  secondsNum: number;
  messageId?: ObjectId;
  repeatInterval?:number;
}

export interface MinyanDocument {
  id: ObjectId;
  roomId: ObjectId;
  startDate: AlertTypeDocument;
  endDate: AlertTypeDocument;
  dateType: eDateType;
  blink?: BlinkAlertTypeDocument;
  specificDate?: SpecificDateType;
  inactiveDates?: SpecificDateType[];
  steadyFlag?: boolean;
}
