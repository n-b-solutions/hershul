import * as React from 'react';
import { fetchRooms } from '@/redux/room/room-slice';
import { AppDispatch } from '@/redux/store';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';

import { eDateType } from '../../../../../../lib/types/minyan.type';
import CalendarContainer from './calendar-tab/CalendarContainer';
import LuachMinyansTable from './LuachMinyansTable';
import { MinyansTable } from './MinyansTable';

export const MinyansSettings = ({ dateType }: { dateType: eDateType }): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const [isScroll, setIsScroll] = React.useState<boolean>(false);

  React.useEffect(() => {
    const getRooms = async () => await dispatch(fetchRooms());
    getRooms();
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
      {dateType === eDateType.calendar ? (
        <>
          <CalendarContainer scrollAction={{ isScroll, setIsScroll }} />
        </>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', height: '100%', flexDirection: 'row', gap: 2 }}>
          <Box
            sx={{ flex: 9, display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '100%' }}
            onScroll={() => setIsScroll(true)}
          >
            <MinyansTable dateType={dateType} scrollAction={{ isScroll, setIsScroll }} />
          </Box>
          <Box
            sx={{ flex: 11, display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '100%' }}
            onScroll={() => setIsScroll(true)}
          >
            <LuachMinyansTable dateType={dateType} scrollAction={{ isScroll, setIsScroll }} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MinyansSettings;
