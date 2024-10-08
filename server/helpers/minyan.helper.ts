import { MinyanType } from "../../lib/types/minyan.type";
import { MinyanDocument } from "../types/minyan.type";

export const getActiveMinyans = (minyans: MinyanType[] | MinyanDocument[]) => {
  const now = new Date();
  return minyans.filter(
    (minyan) => now >= minyan.startDate.time && now <= minyan.endDate.time
  );
};
