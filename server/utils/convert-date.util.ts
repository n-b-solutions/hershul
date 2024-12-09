import { HDate } from "@hebcal/core";
import { SpecificDateType } from "../../lib/types/minyan.type";

export const convertHDateToDate = (hDate: HDate): Date => {
  return new Date(hDate.getFullYear(), hDate.getMonth() - 1, hDate.getDate());
};

export const convertToHebrewDayAndMonth = (date: Date): SpecificDateType => {
  const hDate = new HDate(date);
  return {
    date,
    hebrewMonth: hDate.getMonthName(),
    hebrewDayMonth: hDate.getDate().toString(),
  };
};