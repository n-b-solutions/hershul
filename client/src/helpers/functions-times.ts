import { ONE_MINUTE } from '@/consts/setting-minyans';
import dayjs from 'dayjs';

export const sortByTime = (array: any): any => {
  const sortArray = array.sort((a: any, b: any) => {
    const timeStartA = dayjs().hour(dayjs(a.startDate).get('hour')).minute(dayjs(a.startDate).get('minute'));
    const timeStartB = dayjs().hour(dayjs(b.startDate).get('hour')).minute(dayjs(b.startDate).get('minute'));
    const timeEndA = dayjs().hour(dayjs(a.endDate).get('hour')).minute(dayjs(a.endDate).get('minute'));
    const timeEndB = dayjs().hour(dayjs(b.endDate).get('hour')).minute(dayjs(b.endDate).get('minute'));
    if (timeStartA.isAfter(timeStartB)) return 1;
    else if (timeStartA.isSame(timeStartB)) {
      if (timeEndA.isAfter(timeEndB)) return 1;
      else return -1;
    } else return -1;
  });
  return sortArray;
};

export const getMiddleTime = (beforeDate: Date | undefined, afterDate: Date | undefined): Date => {
  const beforeTime = dayjs(beforeDate);
  const aftertime = dayjs(afterDate);
  const hourAfter = aftertime.get('hour');
  let hourBefore = beforeTime.get('hour');
  const minuteAfter = aftertime.get('minute');
  let minuteBefore = beforeTime.get('minute');
  let newTimeAfter = dayjs().hour(hourAfter).minute(minuteAfter);
  let newTimeBefore = dayjs().hour(hourBefore).minute(minuteBefore);
  if (!beforeDate) {
    return newTimeAfter.subtract(ONE_MINUTE, 'minute').toDate();
  }
  if (!afterDate) {
    return newTimeBefore.add(ONE_MINUTE, 'minute').toDate();
  }
  //replace with before and after
  if (newTimeAfter.isBefore(newTimeBefore)) {
    let saveDateAfter = newTimeAfter;
    newTimeAfter = newTimeBefore;
    newTimeBefore = saveDateAfter;
    hourBefore = hourAfter;
    minuteBefore = minuteAfter;
  }

  const min = newTimeAfter.diff(newTimeBefore, 'minutes');
  const newTime = dayjs()
    .hour(hourBefore)
    .minute(minuteBefore + min / 2);

  return dayjs(newTime).toDate();
};