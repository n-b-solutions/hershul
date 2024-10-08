export enum eDateType {
  sunday = "sunday",
  monday = "monday",
  friday = "friday",
  saturday = "saturday",
  roshHodesh = "roshHodesh",
  calendar = "calendar",
}

export interface AlertType {
  time: Date;
  messageId?: string;
}
export interface BlinkAlertType {
  secondsNum: number;
  messageId?: string;
}
export interface MinyanType {
  id: string;
  roomId: string;
  startDate: AlertType;
  endDate: AlertType;
  dateType: eDateType;
  blink?: BlinkAlertType;
  steadyFlag: boolean;
}
