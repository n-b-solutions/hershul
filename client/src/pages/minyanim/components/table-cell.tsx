import * as React from 'react';
import type { Istate } from '@/redux/setting-times/setting-times-slice';
import { updateSettingTimesValue } from '@/redux/setting-times/setting-times-slice';
import type { RootState } from '@/redux/store';
import { Box, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import type { LineItemTable, TablePropForEdit } from '@/types/minyanim';

const style = {
  display: 'grid',
  justifyItems: 'center',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  height: '54px',
};
export function EditTableCell(props: {
  column: keyof TablePropForEdit;
  row: LineItemTable;
  index: number;
  isDate?: boolean;
  isStatusEdit:boolean;
  setStatusEdit:(isedit:boolean)=>void;
}): React.JSX.Element {
  const cellRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    cellRef.current?.focus();
  });
 

  const [istoShowInput,setIstoShowInput]=React.useState<boolean>(false);

  const currentRow: Istate = useSelector((state: RootState) => state.settingTimes);
  const currentColumn = currentRow?.settingTimesItem;
  const update = currentColumn[props.index];
  const value = update[props.column];
  const dispatch = useDispatch();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(updateSettingTimesValue({ index: props.index, column: props.column, value: e.target.value }));
  };

  const handleClick = (): void => {
    setIstoShowInput(true)
  };

  const handleBlur = (): void => {
    props.setStatusEdit(false);
    setIstoShowInput(false)
  };

  return (
    <Box>
      {/* {!props.isStatusEdit ? (  */}
      {!istoShowInput ? (
        <Typography
          component="span"
          onClick={handleClick}
          position="relative"
          sx={style}
          variant="inherit"
        >
          {value}
        </Typography>
      ) : (
        <TextField
          inputRef={cellRef}
          name={props.column+props.index}
          onBlur={handleBlur}
          onChange={handleChange}
          sx={{ ...style }}
          type={props.isDate ? 'time' : 'number'}
          value={value}
        />
      )}
    </Box>
  );
}
