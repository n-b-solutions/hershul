import * as React from 'react';
import type { TypeOfDate } from '@/types/minyanim';
import Tab from '@mui/material/Tab/Tab';
import Tabs from '@mui/material/Tabs';

const typesOfDates: TypeOfDate[] = [
    { value: 0, label: 'Sunday & Tuesday & Wednesday' },
    { value: 1, label: "Monday & Thursday" },
    { value: 3, label: "Friday" },
    { value: 4, label: "Saturday" },
    { value: 5, label: "RoshHodesh" },
    { value: 6, label: "Taanit" },
    { value: 7, label: "Yom Tov" },
    { value: 8, label: "Calendar" },
];

export function TypeOfDateComponent(): React.JSX.Element {

    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) : void => {
        setValue(newValue);
    }
    return (
            <Tabs onChange={handleChange} sx={{padding:'24px'}} value={value}>
                {typesOfDates.map((typeOfDate: TypeOfDate) => (
                  <Tab {...typeOfDate} key={typeOfDate.value} />
                ))}
            </Tabs>
    )

}