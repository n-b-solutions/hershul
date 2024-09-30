import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/consts/api';
import {
  EMPTY_STRING,
  IMPORT_MINYANS,
  TITTLE_IMPORT_MINYAN_MODEL,
  typesOfDates,
  WARRNING_IMPORT_MINYAN,
} from '@/consts/setting-minyans';
import { setSettingTimes } from '@/state/setting-times/setting-times-slice';
import { RootState } from '@/state/store';
import { Box, Button, Dialog, Paper, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { isEmptyObject } from '@tiptap/react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { TypeOfDate } from '@/types/minyanim';
import { Option } from '@/components/core/option';

import { eDateType } from '../../../../../bin/types/minyan.type';

export interface CountMinyanOfDate {
  category: TypeOfDate;
  count: number;
}

export function ImportMinyans(): React.JSX.Element {
  const [datetype, setDatetype] = useState<eDateType | string>(EMPTY_STRING);
  const [datetypeArray, setDatetypeArray] = useState<CountMinyanOfDate[]>([]);
  const [countMinyan, setCountMinyan] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const currentDateType = useSelector((state: RootState) => state.settingTimes.dateType);
  const dispatch = useDispatch();

  useEffect(() => {
    Promise.all(
      typesOfDates.map(async (type: TypeOfDate) => {
        return await axios
          .get(`${API_BASE_URL}/minyan/import/count/${type.value}`)
          .then<CountMinyanOfDate>((res: { data: number }) => {
            return { category: type, count: res.data };
          })
          .catch((err: any) => console.log('Error fetching data: ', err));
      })
    ).then((res: any) => {
      setDatetypeArray(res?.filter((dtCount: CountMinyanOfDate) => dtCount.count !== 0));
    });
  }, []);

  const handleChange = (e: SelectChangeEvent<any>) => {
    setDatetype(e.target.value);
    const countMinyan: CountMinyanOfDate | undefined = datetypeArray.find(
      (f: CountMinyanOfDate) => f.category.value === e.target.value
    );
    countMinyan && setCountMinyan(countMinyan.count);
  };

  const handleImport = () => {
    axios
      .post(`${API_BASE_URL}/minyan/import/${datetype}`, { currentDateType })
      .then((res) => {
        dispatch(
          setSettingTimes({
            setting: res.data,
          })
        );
      })
      .catch((err) => console.log('Error fatching data: ', err));
  };

  const handleClose = () => {
    setOpen(false);
    setDatetype(EMPTY_STRING);
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
                <Select fullWidth value={datetype} onChange={handleChange}>
                  <Option value={EMPTY_STRING} disabled>
                    Choose Category
                  </Option>
                  {datetypeArray?.map((option: CountMinyanOfDate) => (
                    <Option value={option.category?.value} key={option.category?.value}>
                      {option.category?.label}
                    </Option>
                  ))}
                </Select>
                <Select fullWidth disabled value={EMPTY_STRING}>
                  <Option value={EMPTY_STRING} disabled>
                    Select Date
                  </Option>
                </Select>

                {countMinyan && (
                  <Typography variant="h6" sx={{ color: 'red', textAlign: 'center' }}>
                    {WARRNING_IMPORT_MINYAN(countMinyan)}
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                <div>
                  <Button onClick={handleClose}>Cancel</Button>
                </div>
                <div>
                  <Button disabled={!countMinyan} onClick={handleImport}>
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
