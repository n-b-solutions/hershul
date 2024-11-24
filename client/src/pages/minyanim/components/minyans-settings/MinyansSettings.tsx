import * as React from 'react';
import { fetchRooms } from '@/redux/room/room-slice';
import { AppDispatch } from '@/redux/store';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';

import { eDateType } from '../../../../../../lib/types/minyan.type';
import { Calendar } from './Calendar';
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
      <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '100%' }} onScroll={() => setIsScroll(true)}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          {dateType === eDateType.calendar ? (
            <>
              <Calendar scrollAction={{ isScroll, setIsScroll }} />
              <Calendar scrollAction={{ isScroll, setIsScroll }} />
            </>
          ) : (
            <>
              <MinyansTable dateType={dateType} scrollAction={{ isScroll, setIsScroll }} />
              <LuachMinyansTable dateType={dateType} scrollAction={{ isScroll, setIsScroll }} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MinyansSettings;
