import { EditMinyanValueType, MinyanType, NewMinyanType } from "./minyan.type";
import { MessageType } from "./message.type";

export enum eJewishTimeOfDay {
  chatzotNight = "Chatzot Night",
  alotHaShachar = "Alot Ha Shachar",
  misheyakir = "Misheyakir",
  misheyakirMachmir = "Misheyakir Machmir",
  dawn = "Dawn",
  sunrise = "Sunrise",
  sofZmanShmaMGA19Point8 = "Sof Zman Shma MGA 19.8",
  sofZmanShmaMGA16Point1 = "Sof Zman Shma MGA 16.1",
  sofZmanShmaMGA = "Sof Zman Shma MGA",
  sofZmanShma = "Sof Zman Shma",
  sofZmanTfillaMGA19Point8 = "Sof Zman Tfilla MGA 19.8",
  sofZmanTfillaMGA16Point1 = "Sof Zman Tfilla MGA 16.1",
  sofZmanTfillaMGA = "Sof Zman Tfilla MGA",
  sofZmanTfilla = "Sof Zman Tfilla",
  chatzot = "Chatzot",
  minchaGedola = "Mincha Gedola",
  minchaGedolaMGA = "Mincha Gedola MGA",
  minchaKetana = "Mincha Ketana",
  minchaKetanaMGA = "Mincha Ketana MGA",
  plagHaMincha = "Plag Ha Mincha",
  sunset = "Sunset",
  beinHaShmashos = "Bein Ha Shmashos",
  dusk = "Dusk",
  tzeit7083deg = "Tzeit 7.083 deg",
  tzeit85deg = "Tzeit 8.5 deg",
  tzeit42min = "Tzeit 42 min",
  tzeit50min = "Tzeit 50 min",
  tzeit72min = "Tzeit 72 min",
}

export enum eRelativeTime {
  before = "Before",
  on = "On",
  after = "After",
}

export interface LuachMinyanType
  extends Omit<MinyanType, "startDate" | "endDate"> {
  timeOfDay: {
    value: keyof typeof eJewishTimeOfDay;
    message?: MessageType;
  };
  relativeTime: keyof typeof eRelativeTime;
  relativeTimeDetail?: number;
  duration: {
    value: number;
    message?: MessageType;
  };
}

export interface NewLuachMinyanType
  extends Omit<NewMinyanType, "startTime" | "endTime"> {
  timeOfDay: keyof typeof eJewishTimeOfDay;
  relativeTime: keyof typeof eRelativeTime;
  relativeTimeDetail?: number;
  duration: number;
}

export type EditLuachMinyanValueType =
  | Exclude<EditMinyanValueType, Date>
  | eJewishTimeOfDay
  | eRelativeTime;

export interface EditedLuachType {
  editedValue: EditLuachMinyanValueType;
}
