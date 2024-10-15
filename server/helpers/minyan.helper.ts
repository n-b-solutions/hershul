import axios from "axios";

import { eDateType, MinyanType } from "../../lib/types/minyan.type";
import { MinyanDocument } from "../types/minyan.type";

export const getActiveMinyans = (minyans: MinyanType[] | MinyanDocument[]) => {
  const now = new Date();
  return minyans.filter(
    (minyan) => now >= minyan.startDate.time && now <= minyan.endDate.time
  );
};

// Function to determine if today is Rosh Chodesh
export const isRoshChodesh = async (): Promise<boolean> => {
  const now = new Date();
  const hebcalRes = await axios.get(
    `https://www.hebcal.com/converter?cfg=json&gy=${now.getFullYear()}&gm=${
      now.getMonth() + 1
    }&gd=${now.getDate()}&g2h=1`
  );
  const data = hebcalRes.data;

  if (
    data.events &&
    data.events.some((event: string | string[]) =>
      event.includes("Rosh Chodesh")
    )
  )
    return true;
  return false;
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
  const roshChodesh = await isRoshChodesh();

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
