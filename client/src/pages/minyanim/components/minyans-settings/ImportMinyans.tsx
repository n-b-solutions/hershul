
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/const/api.const';
import {
  EMPTY_STRING,
  IMPORT_MINYANS,
  TITTLE_IMPORT_MINYAN_MODEL,
  typesOfDates,
  WARNING_IMPORT_MINYAN,
} from '@/const/minyans.const';
import { setSettingTimes } from '@/redux/minyans/setting-times-slice';
import { RootState } from '@/redux/store';
import { Box, Button, Dialog, Paper, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { SelectOption } from '@/types/metadata.type';
import JewishDatePicker from '@/components/core/jewish-datepicker';
import { Option } from '@/components/core/option';

import { CountType } from '../../../../../../lib/types/metadata.type';
import { eDateType } from '../../../../../../lib/types/minyan.type';

export interface CountMinyanOfDate {
  category: SelectOption<eDateType>;
  count: number;
}

export function ImportMinyans(): React.JSX.Element {
  const [dateType, setDateType] = useState<eDateType | string>(EMPTY_STRING);
  const [dateTypeArray, setDateTypeArray] = useState<CountMinyanOfDate[]>([]);
  const [countMinyan, setCountMinyan] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [open, setOpen] = useState<boolean>(false);
  const currentDateType = useSelector((state: RootState) => state.minyans.dateType);
  console.log('currentDateType', currentDateType);
  const dispatch = useDispatch();

  useEffect(() => {
    Promise.all(
      typesOfDates.map(async (type: SelectOption<eDateType>) => {
        return await axios
          .get<CountType>(`${API_BASE_URL}/minyan/import/count/${type.value}`)
          .then((res) => {
            return { category: type, count: res.data.count };
          })
          .catch((err: any) => console.log('Error fetching data: ', err));
      })
    ).then((res: any) => {
      setDateTypeArray(
        res?.filter(
          (dtCount: CountMinyanOfDate) => dtCount.count !== 0 || dtCount.category.value === eDateType.calendar
        )
      );
    });
  }, []);

  useEffect(() => {
    axios
      .get<CountType>(`${API_BASE_URL}/minyan/import/count/calendar/${selectedDate}`)
      .then((res) => {
        setDateTypeArray((currentDateTypeArray) => {
          const calendarIndex = currentDateTypeArray.findIndex(
            (f: CountMinyanOfDate) => f.category.value === eDateType.calendar
          );
          currentDateTypeArray[calendarIndex].count = res.data.count;
          setCountMinyan(res.data.count);
          return currentDateTypeArray;
        });
      })
      .catch((err: any) => console.log('Error fetching data: ', err));
  }, [selectedDate]);

  const handleChange = (e: SelectChangeEvent<any>) => {
    setDateType(e.target.value);
    const countMinyan: CountMinyanOfDate | undefined = dateTypeArray.find(
      (f: CountMinyanOfDate) => f.category.value === e.target.value
    );
    countMinyan && setCountMinyan(countMinyan.count);
  };

  const handleImport = () => {
    axios
      .post(`${API_BASE_URL}/minyan/import/${dateType}`, { currentDateType })
      .then((res) => {
        dispatch(
          setSettingTimes({
            setting: res.data,
          })
        );
      })
      .catch((err) => console.log('Error fetching data: ', err));
  };

  const handleClose = () => {
    setOpen(false);
    setDateType(EMPTY_STRING);
    setCountMinyan(null);
  };

  return (
    <>
      <Button disabled={open} onClick={() => setOpen(true)}>
        {IMPORT_MINYANS}
      </Button>
      <Dialog
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
            padding: 0,
            margin: 0,
            width: '400px',
          },
        }}
        BackdropProps={{ invisible: true }}
        open={open}
        onClose={handleClose}
        onClick={(event) => event.stopPropagation()}
        onMouseOver={(event) => event.stopPropagation()}
      >
        <Box sx={{ bgcolor: 'transparent', p: 3 }}>
          <Paper
            sx={{
              boxShadow: 'var(--mui-shadows-16)',
              border: '1px solid var(--mui-palette-divider)',
              maxWidth: '100%',
              mx: 'auto',
              width: '100%',
              overflow: 'visible',
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', display: 'flex', p: 2 }}>
              <Box sx={{ flex: '1 1 auto' }}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  {TITTLE_IMPORT_MINYAN_MODEL}
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ justifyContent: 'center' }}>
              <Stack spacing={3} sx={{ alignItems: 'center', justifyContent: 'center', p: 2 }}>
                <Select fullWidth value={dateType} onChange={handleChange}>
                  <Option value={EMPTY_STRING} disabled>
                    Choose Category
                  </Option>
                  {dateTypeArray?.map((option: CountMinyanOfDate) => (
                    <Option value={option.category?.value} key={option.category?.value}>
                      {option.category?.label}
                    </Option>
                  ))}
                </Select>

                {dateType === eDateType.calendar && (
                  <JewishDatePicker
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    label="Select Date"
                    sx={{ width: '318px', height: '40px' }}
                  />
                )}
                {dateType !== eDateType.calendar && <Box sx={{ width: '318px', height: '40px' }} />}
                {countMinyan ? (
                  <Typography variant="h6" sx={{ color: 'red', textAlign: 'center' }}>
                    {WARNING_IMPORT_MINYAN(countMinyan)}
                  </Typography>
                ) : null}
              </Stack>
              <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                <div>
                  <Button onClick={handleClose}>Cancel</Button>
                </div>
                <div>
                  <Button disabled={!countMinyan || !selectedDate} onClick={handleImport}>
                    Import
                  </Button>
                </div>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Dialog>
    </>
  );
}
