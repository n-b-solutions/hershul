import axios from "axios";
import { eDateType } from "../types/minyan";

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
  
  export async function getQueryDateType(): Promise<string> {
    let queryDateType: string;
  
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
    const roshChodesh = await isRoshChodesh();
  
    if (roshChodesh) {
      queryDateType = eDateType.ROSH_HODESH;
    } else {
      // Determine default dateType based on the day of the week
      switch (dayOfWeek) {
        case 0: // Sunday
        case 2: // Tuesday
        case 3: // Thursday
          queryDateType = eDateType.SUNDAY;
          break;
        case 1: // Monday
        case 4: // Wednesday
          queryDateType = eDateType.MONDAY;
          break;
        case 5: // Friday
          queryDateType = eDateType.FRIDAY;
          break;
        case 6: // Saturday (Shabbat)
          queryDateType = eDateType.SATURDAY;
          break;
        default:
          queryDateType = eDateType.DEFAULT; // Fallback default value
      }
    }
  
    return queryDateType;
  }
  