import { LuachMinyanType } from "../../lib/types/luach-minyan.type";
import { MinyanType } from "../../lib/types/minyan.type";
import { getTimeOfDayDate } from "../helpers/time.helper";

export const convertLuachMinyanToMinyan = async (
  luachMinyan: LuachMinyanType
): Promise<MinyanType> => {
  let startDate = await getTimeOfDayDate(luachMinyan.timeOfDay.value);
  if (luachMinyan.relativeTime === 'before' && luachMinyan.relativeTimeDetail) {
    startDate = new Date(startDate.getTime() - luachMinyan.relativeTimeDetail * 60000);
  } else if (luachMinyan.relativeTime === 'after' && luachMinyan.relativeTimeDetail) {
    startDate = new Date(startDate.getTime() + luachMinyan.relativeTimeDetail * 60000);
  }
  const endDate = new Date(startDate.getTime() + luachMinyan.duration.value * 60000);

  return {
    ...luachMinyan,
    startDate: {
      time: startDate,
      message: luachMinyan.timeOfDay.message,
    },
    endDate: {
      time: endDate,
      message: luachMinyan.duration.message,
    },
  };
};
