import * as React from 'react';
import { Grid } from '@mui/material';
import { PlusCircle } from '@phosphor-icons/react/dist/ssr/PlusCircle';
import { eLocationClick } from '@/consts/setting-minyans';

export function AddRow(props: { index: number; onPlusClick: (index: number,location:number) => void }): React.JSX.Element {
  const [isHover, setIsHover] = React.useState<{ isHover: boolean; line: number }>({
    isHover: false,
    line: 0,
  });

  const handleHover = (index: number, line: number): void => {
    setIsHover({ isHover: true, line });
  };

  const getTop = (index: number): string => {
    const top = (index + 1) * 55 - 1;
    return `${top.toString()}px`;
  };

  const handleLeave = (): void => {
    setIsHover({ ...isHover, isHover: false });
  };

  const plusStyle = {
    position: 'absolute',
    left: '50%',
    width: '25px',
    color: '#635bff',
  };
  const rowStyle = {
    height: '27px',
    width: '100%',
    position: 'absolute',
    right: '0px',
  };

  return (
    <Grid container direction="column" spacing={0}>
      <Grid
        item
        onMouseLeave={handleLeave}
        onMouseOver={() => {
          handleHover(props.index, eLocationClick.top);
        }}
        sx={{ ...rowStyle, top: getTop(props.index) }}
        xs={16}
      >
        {isHover.isHover && isHover.line === eLocationClick.top ? (
          <Grid
            item
            onClick={() => {
              props.onPlusClick(props.index,eLocationClick.top);
            }}
            sx={{ ...plusStyle, bottom: '5px' }}
          >
            <PlusCircle size={32} />
          </Grid>
        ) : null}
      </Grid>
      {
        <Grid
          item
          onMouseLeave={handleLeave}
          onMouseOver={() => {
            handleHover(props.index, eLocationClick.bottom);
          }}
          sx={{ ...rowStyle }}
          xs={16}
        >
          {isHover.isHover && isHover.line === eLocationClick.bottom? (
            <Grid
              item
              onClick={() => {
                props.onPlusClick(props.index,eLocationClick.bottom);
              }}
              sx={{ ...plusStyle, top: '12px' }}
            >
              <PlusCircle size={32} />
            </Grid>
          ) : null}
        </Grid>
      }
    </Grid>
  );
}
