import { CheckCircle, XCircle } from '@phosphor-icons/react';
import { Dayjs } from 'dayjs';

import { CalendarRowType } from '@/types/minyans.type';
import { ColumnDef } from '@/types/table.type';
import { LuachCalendarRowType } from '@/types/luach-minyan.type';

export interface CalendarTableProps {
  selectedDate: Dayjs;
  scrollAction: { isScroll: boolean; setIsScroll: React.Dispatch<React.SetStateAction<boolean>> };
}

export const isRoutineColumn: ColumnDef<CalendarRowType| LuachCalendarRowType> = {
  editInputType: 'switch',
  valueForEdit: (row) => row?.isRoutine,
  name: 'Is Routine',
  padding: 'none',
  align: 'center',
  field: 'isRoutine',
  editable: true,
  formatter: (row) => {
    if (row.isRoutine === undefined) return <></>;
    return row?.isRoutine ? <CheckCircle size={24} /> : <XCircle size={24} />;
  },
};
