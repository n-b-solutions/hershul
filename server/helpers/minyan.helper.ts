import { eDateType, MinyanType } from "../../lib/types/minyan.type";
import { MinyanDocument } from "../types/minyan.type";
import { isRoshHodesh } from "./time.helper";

export const getActiveMinyans = (minyans: MinyanType[] | MinyanDocument[]) => {
  const now = new Date();
  return minyans.filter(
    (minyan) => now >= minyan.startDate.time && now <= minyan.endDate.time
  );
};

export async function getQueryDateType(date?: Date): Promise<string> {
  let queryDateType: string;
  let dayOfWeek;
  if (date) {
    dayOfWeek = date.getDay();
  } else {
    const today = new Date();
    dayOfWeek = today.getDay();
  }
  const roshChodesh = await isRoshHodesh();

  if (roshChodesh) {
    queryDateType = eDateType.roshHodesh;
  } else {
    switch (dayOfWeek) {
      case 0: // Sunday
      case 2: // Tuesday
      case 3: // Thursday
        queryDateType = eDateType.sunday;
        break;
      case 1: // Monday
      case 4: // Wednesday
        queryDateType = eDateType.monday;
        break;
      case 5: // Friday
        queryDateType = eDateType.friday;
        break;
      case 6: // Saturday (Shabbat)
        queryDateType = eDateType.saturday;
        break;
      default:
        queryDateType = eDateType.calendar; // Fallback default value
    }
  }

  return queryDateType;
}
