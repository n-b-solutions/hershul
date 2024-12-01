import * as React from 'react';
import { typesOfDates } from '@/const/minyans.const';
import { setCurrentDateType } from '@/redux/minyans/setting-times-slice';
import { fetchRooms } from '@/redux/room/room-slice';
import { AppDispatch, RootState } from '@/redux/store';
import { Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';

import { eDateType } from '../../../../../../lib/types/minyan.type';
import CalendarContainer from './calendar-tab/CalendarContainer';
import LuachMinyansTable from './LuachMinyansTable';
import { MinyansTable } from './MinyansTable';

export const MinyansSettings = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const currentType = useSelector((state: RootState) => state.minyans.dateType);
  const [isScroll, setIsScroll] = React.useState<boolean>(false);

  React.useEffect(() => {
    const getRooms = async () => await dispatch(fetchRooms());
    getRooms();
  }, [dispatch]);

  const handleTypeChange = (_: React.SyntheticEvent, value: eDateType) => {
    dispatch(setCurrentDateType({ currentType: value }));
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      <Tabs onChange={handleTypeChange} sx={{ px: 3 }} value={currentType} variant="scrollable">
        {typesOfDates.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      {currentType === eDateType.calendar ? (
        <CalendarContainer scrollAction={{ isScroll, setIsScroll }} />
      ) : (
        <Box sx={{ flex: 1, display: 'flex', height: '100%', flexDirection: 'row', gap: 2 }}>
          <Box
            sx={{ flex: 9, display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '100%' }}
            onScroll={() => setIsScroll(true)}
          >
            <MinyansTable dateType={currentType} scrollAction={{ isScroll, setIsScroll }} />
          </Box>
          <Box
            sx={{ flex: 11, display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '100%' }}
            onScroll={() => setIsScroll(true)}
          >
            <LuachMinyansTable dateType={currentType} scrollAction={{ isScroll, setIsScroll }} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MinyansSettings;
