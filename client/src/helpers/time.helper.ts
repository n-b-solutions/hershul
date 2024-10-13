import { GENERATE_TIME } from '@/const/minyans.const';
import dayjs from 'dayjs';

import { MinyanType } from '../../../lib/types/minyan.type';

export const isMinyanInactiveForSelectedDate = (selectedDate: Date, inactiveDates: any[] = []): boolean => {
  if (!inactiveDates || !Array.isArray(inactiveDates)) return false;

  return inactiveDates.some((inactiveDate) => {
    if (!inactiveDate || !inactiveDate.date) return false; // Check for null or undefined
    const elementDate = new Date(inactiveDate.date).toISOString().split('T')[0];
    return elementDate === selectedDate.toISOString().split('T')[0];
  });
};

export const sortByTime = (array: any): any => {
  const sortArray = array.sort((a: MinyanType, b: MinyanType) => {
    const timeStartA = dayjs()
      .hour(dayjs(a.startDate?.time).get('hour'))
      .minute(dayjs(a.startDate?.time).get('minute'));
    const timeStartB = dayjs()
      .hour(dayjs(b.startDate?.time).get('hour'))
      .minute(dayjs(b.startDate?.time).get('minute'));
    const timeEndA = dayjs().hour(dayjs(a.endDate?.time).get('hour')).minute(dayjs(a.endDate?.time).get('minute'));
    const timeEndB = dayjs().hour(dayjs(b.endDate?.time).get('hour')).minute(dayjs(b.endDate?.time).get('minute'));
    if (timeStartA.isAfter(timeStartB, 'minute')) return 1;
    else if (timeStartA.isSame(timeStartB, 'minute')) {
      if (timeEndA.isAfter(timeEndB, 'minute')) return 1;
      else;
      if (timeEndA.isSame(timeEndB, 'minute')) return 1;
      else return -1;
    } else return -1;
  });
  return sortArray;
};

export const getMiddleTime = (beforeDate: Date | string | undefined, afterDate: Date | string | undefined): Date => {
  const beforeTime = dayjs(beforeDate && new Date(beforeDate));
  const aftertime = dayjs(afterDate && new Date(afterDate));
  const hourAfter = aftertime.get('hour');
  let hourBefore = beforeTime.get('hour');
  const minuteAfter = aftertime.get('minute');
  let minuteBefore = beforeTime.get('minute');
  let newTimeAfter = dayjs().hour(hourAfter).minute(minuteAfter);
  let newTimeBefore = dayjs().hour(hourBefore).minute(minuteBefore);
  if (!beforeDate) {
    return newTimeAfter.subtract(GENERATE_TIME, 'minute').toDate();
  }
  if (!afterDate) {
    return newTimeBefore.add(GENERATE_TIME, 'minute').toDate();
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
