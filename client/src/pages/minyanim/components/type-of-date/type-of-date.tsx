import * as React from 'react';
import Tab from '@mui/material/Tab/Tab';
import Tabs from '@mui/material/Tabs';

import type { TypeOfDate } from '@/types/minyanim';
import { eDateType } from '../../../../../../bin/types/minyan.type';

const typesOfDates: TypeOfDate[] = [
  { value: eDateType.SUNDAY, label: 'Sunday & Tuesday & Wednesday' },
  { value: eDateType.MONDAY, label: 'Monday & Thursday' },
  { value: eDateType.FRIDAY, label: 'Friday' },
  { value: eDateType.SATURDAY, label: 'Saturday' },
  { value: eDateType.ROSH_HODESH, label: 'Rosh Hodesh' },
  { value: eDateType.CALENDAR, label: 'Calendar' },
];

export function TypeOfDateComponent(
   props:{ onTypeChange:(_: React.SyntheticEvent, value: string)=>void,
    value:string}
): React.JSX.Element {
   
  return (
    <Tabs onChange={props.onTypeChange} sx={{ px: 3 }} value={props.value} variant="scrollable">
      {typesOfDates.map((tab) => (
        <Tab key={tab.value} label={tab.label} value={tab.value} />
      ))}
    </Tabs>
  );
}
