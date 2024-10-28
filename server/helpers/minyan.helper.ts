import { eDateType, MinyanType } from "../../lib/types/minyan.type";
import { MinyanDocument } from "../types/minyan.type";
import { isRoshHodesh, getMinchaGedolaTime } from "./time.helper";

export const getActiveMinyans = (minyans: MinyanType[] | MinyanDocument[]) => {
  const now = new Date();
  return minyans.filter(
    (minyan) => now >= minyan.startDate.time && now <= minyan.endDate.time
  );
};

export const getQueryDateType = async (date?: Date): Promise<eDateType> => {
  const dayOfWeek = getDayOfWeek(date);
  const roshChodesh = await isRoshHodesh();

  if (roshChodesh) {
    return eDateType.roshHodesh;
  } else {
    return getDateTypeByDayOfWeek(dayOfWeek);
  }
};

export const getDayOfWeek = (date?: Date): number => {
  if (date) {
    return date.getDay();
  } else {
    const today = new Date();
    return today.getDay();
  }
};

export const getDateTypeByDayOfWeek = (dayOfWeek: number): eDateType => {
  switch (dayOfWeek) {
    case 0: // Sunday
    case 2: // Tuesday
    case 3: // Thursday
      return eDateType.sunday;
    case 1: // Monday
    case 4: // Wednesday
      return eDateType.monday;
    case 5: // Friday
      return eDateType.friday;
    case 6: // Saturday (Shabbat)
      return eDateType.saturday;
    default:
      return eDateType.calendar; // Fallback default value
  }
};

export const getRoshChodeshCond = async (dateType: eDateType, date: Date) => {
  if (dateType === eDateType.roshHodesh) {
    const dayOfWeekDateType = getDateTypeByDayOfWeek(date.getDay());
    const minchaGedolaTime = await getMinchaGedolaTime(date);
    return {
      dateType: dayOfWeekDateType,
      "startDate.time": { $gte: minchaGedolaTime },
    };
  }
  return {};
};
