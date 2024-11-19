import { MinyanType, NewMinyanType, SpecificDateType } from "./minyan.type";
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
  on = "on",
  before = "before",
  after = "after",
}

export interface LuachMinyanType
  extends Omit<MinyanType, "startDate" | "endDate"> {
  timeOfDay: {
    value: eJewishTimeOfDay;
    message?: MessageType;
  };
  relativeTime: eRelativeTime;
  duration: {
    value: number;
    message?: MessageType;
  };
}

export interface NewLuachMinyanType
  extends Omit<NewMinyanType, "startTime" | "endTime"> {
  timeOfDay: eJewishTimeOfDay;
  relativeTime: eRelativeTime;
  duration: number;
}
