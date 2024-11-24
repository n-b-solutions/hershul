import { EditMinyanValueType, MinyanType, NewMinyanType } from "./minyan.type";
import { MessageType } from "./message.type";

export enum eJewishTimeOfDay {
  alotHaShachar = "Alot HaShachar",
  misheyakir = "Misheyakir",
  netz = "Netz",
  sofZmanShma = "Sof Zman Shma",
  sofZmanTfilla = "Sof Zman Tfilla",
  chatzot = "Chatzot",
  minchaGedola = "Mincha Gedola",
  minchaKetana = "Mincha Ketana",
  plagHaMincha = "Plag HaMincha",
  sunset = "Sunset",
  tzeit = "Tzeit",
  tzeit42Min = "Tzeit 42 Min",
  tzeit72Min = "Tzeit 72 Min",
  midnight = "Midnight",
}

export enum eRelativeTime {
  on = "On",
  before = "Before",
  after = "After",
}

export interface LuachMinyanType
  extends Omit<MinyanType, "startDate" | "endDate"> {
  timeOfDay: {
    value: keyof typeof eJewishTimeOfDay;
    message?: MessageType;
  };
  relativeTime: keyof typeof eRelativeTime;
  duration: {
    value: number;
    message?: MessageType;
  };
}

export interface NewLuachMinyanType
  extends Omit<NewMinyanType, "startTime" | "endTime"> {
  timeOfDay: keyof typeof eJewishTimeOfDay;
  relativeTime: keyof typeof eRelativeTime;
  duration: number;
}

export type EditLuachMinyanValueType =
  | Exclude<EditMinyanValueType, Date>
  | eJewishTimeOfDay
  | eRelativeTime;

export interface EditedLuachType {
  editedValue: EditLuachMinyanValueType;
}
