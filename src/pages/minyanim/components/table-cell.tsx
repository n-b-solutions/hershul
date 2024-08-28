import type { LineItemTable, TablePropForEdit } from '@/types/minyanim';
import { Box, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Istate} from '@/redux/setting-times/setting-times-slice';
import { setIsToShowPlus, updateSettingTimesValue } from '@/redux/setting-times/setting-times-slice';
import type { RootState } from '@/redux/store';

const style = {
    display:'grid',
    justifyItems:'center',
    alignItems:'center',
    whiteSpace: 'nowrap', height:"54px"
    }
export function EditTableCell(props:{column:keyof TablePropForEdit, row:LineItemTable, index:number, isDate?:boolean}):React.JSX.Element
{
    const [tableprops, setTableprops]=React.useState<TablePropForEdit>({
        blink:{isInput:false},
        startTime:{isInput:false},
        endTime:{isInput:false},
        room:{isInput:false},
      })

      const currentRow:Istate = useSelector((state:RootState)=>state.settingTimes);
      const currentColumn =currentRow?.settingTimesItem;
      const update=currentColumn[props.index];
      const value  = update[props.column];
      const dispatch = useDispatch();

      const handleChange =(e:React.ChangeEvent<HTMLInputElement>):void=>{
        dispatch(updateSettingTimesValue({index:props.index,column:props.column,value:e.target.value}))
      }

      const handleClick =(name:keyof TablePropForEdit):void=>{
       setTableprops({...tableprops,[name]:{...tableprops[name],isInput:true}});
       dispatch(setIsToShowPlus({isToShow:false}))
      }

      const handleBlur =(name:keyof TablePropForEdit):void=>{
        setTableprops({...tableprops,[name]:{...tableprops[name],isInput:false}})
        dispatch(setIsToShowPlus({isToShow:true}))
       }

return(
    <Box>
            {!tableprops[props.column].isInput ? <Typography component='span' onClick={()=>{handleClick(props.column)}} position='relative' sx={style} variant="inherit">
            
           {value}
                  </Typography> :
                   <TextField  name={props. column} onBlur={()=>{handleBlur(props.column)}}  onChange={handleChange} sx={{...style}}
                 type={props.isDate?'time':'number'} value= {value}/>}
                  </Box>
)
}