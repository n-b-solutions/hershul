import { ObjectId } from "mongoose";

import { eDateType } from "../../lib/types/minyan.type";

export interface AlertTypeDocument {
  time: Date;
  messageId?: ObjectId;
}
export interface BlinkAlertTypeDocument {
  secondsNum: number;
  messageId?: ObjectId;
}
export interface MinyanDocument {
  id: ObjectId;
  roomId: ObjectId;
  startDate: AlertTypeDocument;
  endDate: AlertTypeDocument;
  dateType: eDateType;
  blink?: BlinkAlertTypeDocument;
  steadyFlag?: boolean;
}
