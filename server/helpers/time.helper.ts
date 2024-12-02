import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import GeonameidService from "../services/geonameid.service";
import { eJewishTimeOfDay } from "../../lib/types/luach-minyan.type";

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = "America/New_York";

export const isRoshHodesh = async (
  date: Date = new Date()
): Promise<boolean> => {
  const hebcalRes = await axios.get(
    `https://www.hebcal.com/converter?cfg=json&gy=${date.getFullYear()}&gm=${
      date.getMonth() + 1
    }&gd=${date.getDate()}&g2h=1`
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

export const fetchHebcalData = async (date: Date): Promise<any> => {
  let geonameid = GeonameidService.getGeonameid();
  if (!geonameid) {
    console.error("Geonameid not found, defaulting to New York");
    geonameid = "5128581"; // Default to New York
  }

  const hebcalRes = await axios.get(
    `https://www.hebcal.com/zmanim?cfg=json&geonameid=${geonameid}&gy=${date.getFullYear()}&gm=${
      date.getMonth() + 1
    }&gd=${date.getDate()}`
  );
  const hebcalData = hebcalRes.data;

  const timezone = hebcalData.location?.tzid || DEFAULT_TIMEZONE;

  return { hebcalData, timezone };
};

const convertToUTC = (timeString: string, timezone: string): Date => {
  const timeLocal = dayjs.tz(timeString, timezone);
  return timeLocal.utc().toDate();
};

export const getMinchaGedolaTime = async (date: Date): Promise<Date> => {
  const { hebcalData, timezone } = await fetchHebcalData(date);

  if (hebcalData.times && hebcalData.times.minchaGedola) {
    return convertToUTC(hebcalData.times.minchaGedola, timezone);
  }

  throw new Error("Mincha Gedola time not found for the given date");
};

export const getTimeOfDayDate = async (
  timeOfDay: keyof typeof eJewishTimeOfDay
): Promise<Date> => {
  const now = new Date();
  const { hebcalData, timezone } = await fetchHebcalData(now);
  const timeString = hebcalData.times[timeOfDay];
  if (!timeString) {
    throw new Error(`Time for ${timeOfDay} not found`);
  }
  return convertToUTC(timeString, timezone);
};
