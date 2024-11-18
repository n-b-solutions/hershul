import { HDate } from "@hebcal/core";
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

export const getMongoConditionForActiveMinyansByDate = async (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0); // start of day
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999); // end of day

  const hDate = new HDate(date);
  const hebrewDay = hDate.getDate();
  const hebrewMonth = hDate.getMonthName();

  const calendarCond = {
    dateType: "calendar",
    $or: [
      {
        "specificDate.date": {
          $gte: startOfDay.toISOString(),
          $lt: endOfDay.toISOString(),
        },
      },
      {
        "specificDate.isRoutine": true,
        $expr: {
          $and: [
            { $eq: ["$specificDate.hebrewDayMonth", hebrewDay.toString()] },
            { $eq: ["$specificDate.hebrewMonth", hebrewMonth] },
          ],
        },
      },
    ],
  };

  const dateType = await getQueryDateType(date);
  const dateTypeCond = {
    $and: [
      { dateType },
      {
        "inactiveDates.date": {
          $not: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        },
      },
    ],
  };
  const roshChodeshCond = await getRoshChodeshCond(dateType, date);

  return {
    $or: [
      calendarCond, // Assuming calendarCond is always populated
      dateTypeCond, // Assuming dateTypeCond is always populated
      ...(Object.keys(roshChodeshCond).length > 0 ? [roshChodeshCond] : []), // Conditional check for roshChodeshCond
    ],
  };
};
