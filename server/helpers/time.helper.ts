import axios from "axios";

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

export const getMinchaGedolaTime = async (date: Date): Promise<Date> => {
  const hebcalRes = await axios.get(
    `https://www.hebcal.com/zmanim?cfg=json&geonameid=3448439&gy=${date.getFullYear()}&gm=${
      date.getMonth() + 1
    }&gd=${date.getDate()}`
  );
  const data = hebcalRes.data;

  if (data.times && data.times.minchaGedola) {
    const minchaGedolaUTC = new Date(data.times.minchaGedola);
    const minchaGedolaLocal = new Date(
      minchaGedolaUTC.getTime() + minchaGedolaUTC.getTimezoneOffset() * 60000
    );
    return minchaGedolaLocal;
  }

  throw new Error("Mincha Gedola time not found for the given date");
};
