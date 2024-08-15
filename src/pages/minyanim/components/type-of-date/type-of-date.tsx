import { typeOfDate } from '@/types/minyanim';
import { Button } from '@mui/material';
import Tab from '@mui/material/Tab/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';

const typesOfDates: typeOfDate[] = [
    { value: 0, label: 'Sunday & Tuesday & Wednesday' },
    { value: 1, label: "Monday & Thursday" },
    { value: 3, label: "Friday" },
    { value: 4, label: "Saturday" },
    { value: 5, label: "RoshHodesh" },
    { value: 6, label: "Taanit" },
    { value: 7, label: "Yom Tov" },
    { value: 8, label: "Calendar" },
];




export function TypeOfdate(): React.JSX.Element {

    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }
    return (
        <div>
            <Tabs value={value} onChange={handleChange}>
                {typesOfDates.map((typeOfDate: typeOfDate, index: number) => (
                    <Tab {...typeOfDate} key={index} />
                ))}
            </Tabs>
        </div>
    )

}