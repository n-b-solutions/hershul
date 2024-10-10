import { getMiddleTime } from '@/helpers/time.helper';

import { eLocationClick } from '@/types/enums';
import { MinyanDetails, NewMinyan } from '@/types/minyans.type';

import { eDateType } from '../../../lib/types/minyan.type';

export const getNewMinyanObj = (
  minyans: MinyanDetails[],
  dateType: eDateType,
  defaultRoomId: string,
  index: number,
  location?: eLocationClick
): NewMinyan => {
  const indexBefore = location === eLocationClick.top ? index - 1 : index;
  const indexAfter = location === eLocationClick.top ? index : index + 1;
  return {
    startDate:
      index === -1
        ? new Date()
        : getMiddleTime(minyans[indexBefore]?.startDate.time, minyans[indexAfter]?.startDate.time),
    endDate:
      index === -1 ? new Date() : getMiddleTime(minyans[indexBefore]?.endDate.time, minyans[indexAfter]?.endDate.time),
    roomId: defaultRoomId,
    dateType,
    steadyFlag: false,
  };
};

export const getAllMinyans = (): MinyanDetails[] => {
  return [];
};
export const getMinyansByDateType = (dateType: eDateType): MinyanDetails[] => {
  return [];
};
