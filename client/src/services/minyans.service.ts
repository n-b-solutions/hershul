import { getMiddleTime } from '@/helpers/time.helper';

import { eLocationClick } from '@/types/enums';

import { eDateType, MinyanType, NewMinyanType } from '../../../lib/types/minyan.type';

export const getNewMinyanObj = (
  minyans: MinyanType[],
  dateType: eDateType,
  defaultRoomId: string,
  index: number,
  location?: eLocationClick
): NewMinyanType => {
  const indexBefore = location === eLocationClick.top ? index - 1 : index;
  const indexAfter = location === eLocationClick.top ? index : index + 1;
  return {
    startTime:
      index === -1
        ? new Date()
        : getMiddleTime(minyans[indexBefore]?.startDate.time, minyans[indexAfter]?.startDate.time),
    endTime:
      index === -1 ? new Date() : getMiddleTime(minyans[indexBefore]?.endDate.time, minyans[indexAfter]?.endDate.time),
    roomId: defaultRoomId,
    dateType,
  };
};

export const getAllMinyans = (): MinyanType[] => {
  return [];
};
export const getMinyansByDateType = (dateType: eDateType): MinyanType[] => {
  return [];
};
