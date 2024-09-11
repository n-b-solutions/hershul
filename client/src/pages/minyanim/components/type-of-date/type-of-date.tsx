import * as React from 'react';
import Tab from '@mui/material/Tab/Tab';
import Tabs from '@mui/material/Tabs';

import type { TypeOfDate } from '@/types/minyanim';

const typesOfDates: TypeOfDate[] = [
  { value: 'sunday', label: 'Sunday & Tuesday & Wednesday' },
  { value: 'monday', label: 'Monday & Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'roshHodesh', label: 'Rosh Hodesh' },
  { value: 'taanit', label: 'Taanit' },
  { value: 'yomTov', label: 'Yom Tov' },
  { value: 'calendar', label: 'Calendar' },
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
