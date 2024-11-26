import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import GeonameidService from "../services/geonameid.service";
import { eJewishTimeOfDay } from "../../lib/types/luach-minyan.type";

dayjs.extend(utc);
dayjs.extend(timezone);

export const isRoshHodesh = async (): Promise<boolean> => {
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
  return hebcalRes.data;
};

export const getMinchaGedolaTime = async (date: Date): Promise<Date> => {
  const data = await fetchHebcalData(date);

  if (data.times && data.times.minchaGedola) {
    const minchaGedolaLocal = dayjs(data.times.minchaGedola);
    const minchaGedolaUTC = minchaGedolaLocal.utc().toDate();
    return minchaGedolaUTC;
  }

  throw new Error("Mincha Gedola time not found for the given date");
};

export const getTimeOfDayDate = async (
  timeOfDay: keyof typeof eJewishTimeOfDay
): Promise<Date> => {
  const now = new Date();
  const data = await fetchHebcalData(now);
  const timeString = data.times[timeOfDay];
  if (!timeString) {
    throw new Error(`Time for ${timeOfDay} not found`);
  }
  const timeLocal = dayjs(timeString);
  const timeUTC = timeLocal.utc().toDate();
  return timeUTC;
};
