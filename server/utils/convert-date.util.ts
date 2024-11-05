import { HDate } from "@hebcal/core";

export const convertHDateToDate = (hDate: HDate): Date => {
  return new Date(hDate.getFullYear(), hDate.getMonth() - 1, hDate.getDate());
};
