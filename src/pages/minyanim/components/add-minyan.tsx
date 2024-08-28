import type { RootState } from "@/redux/store";
import { Grid } from "@mui/material";
import { PlusCircle } from "@phosphor-icons/react/dist/ssr/PlusCircle";
import * as React from 'react'
import { useSelector } from "react-redux";



export function AddMinyanByPlus(props:{isFinal?:boolean,index:number,handlePlusClick:(index:number)=>void;}):React.JSX.Element{
 
    const [isHover,setIsHover]=React.useState<{isHover:boolean,index:number,line:number}>({isHover:false,index:0,line:0})
 
    const isToShow = useSelector((state:RootState)=>state.settingTimes.isToShowPlus);

    const handleHover=(index:number,line:number):void=>{
        setIsHover({index,isHover:true,line})
      }

  const getTop =(index:number):string=>{
    const  top= (index+1)*55-1;
      return `${top.toString()}px`;
    }

   const handleLeave=():void=>{
    setIsHover({...isHover,isHover:false})
  }

  const plusStyle ={
position: 'absolute', left: '50%', width: '25px', color: '#635bff'
  }
  const rowStyle ={
    height: '27px', width: '100%', position: 'absolute', right: '0px' 
      }
    return(
        <Grid container direction='column' spacing={0} >
     
       <Grid item onMouseLeave={handleLeave} onMouseOver={() => { handleHover(props.index, 1); } }
                    sx={{ ...rowStyle, top: getTop(props.index)}} xs={16}>
                    {isToShow && isHover.isHover &&  isHover.index===props.index && isHover.line===1 ? 
                     <Grid item
                        onClick={() => { props.handlePlusClick( props.index); } }
                        sx={{...plusStyle,bottom:'5px' }}>
                            <PlusCircle size={32} />
                    </Grid>
                    :null}
                </Grid>
               { !props.isFinal && <Grid item onMouseLeave={handleLeave}  onMouseOver={() => { handleHover(props.index,2); } }
                    sx={{ ...rowStyle}} xs={16}>
                     {isToShow && isHover.isHover &&  isHover.index===props.index && isHover.line===2 ?  
                     <Grid item
                        onClick={() => { props.handlePlusClick(props.index+1); } }
                        sx={{...plusStyle,top:'12px' }}>
                            <PlusCircle size={32} />
                    </Grid>
                    :null}
                    </Grid>}
        </Grid>
    )
}