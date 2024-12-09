export interface RoomType {
  id: string;
  name: string;
  bulbStatus: eBulbStatus;
  bulbColor?: eBulbColor;
}

export const enum eBulbStatus {
  on = "on",
  off = "off",
  blink = "blink",
}

export enum eBulbColor {
  white = "white",
  red = "red",
  blue = "blue",
  yellow = "yellow",
}
