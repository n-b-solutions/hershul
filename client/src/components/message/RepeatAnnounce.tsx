import React, { useState } from 'react';
import { Box, Button, Dialog, IconButton, Paper, Typography } from '@mui/material';
import { X as CloseIcon } from '@phosphor-icons/react/dist/ssr/X';

const RepeatAnnounce = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const [repeatInterval, setRepeatInterval] = useState(0);

  const handleSave = () => {
    console.log('Save clicked');
    // Add your save logic here
  };

  const handleSaveWithoutRepeat = () => {
    console.log('Save Without Repeat clicked');
    // Add your save without repeat logic here
  };

  const handleRedo = () => {
    console.log('Redo clicked');
    // Add your redo logic here
  };

  const handleIntervalChange = (e) => {
    setRepeatInterval(e.target.value);
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          overflow: 'visible',
          padding: 0,
          margin: 0,
        },
      }}
      BackdropProps={{ invisible: true }}
      open={open}
      onClose={handleClose}
      onClick={(event) => event.stopPropagation()}
    >
      <Box sx={{ bgcolor: 'transparent', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IconButton
          sx={{ position: 'absolute', top: 22, right: 22, color: 'red', fontSize: '1rem' }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <Paper
          sx={{
            border: '1px solid var(--mui-palette-divider)',
            boxShadow: 'var(--mui-shadows-16)',
            width: '320px',
            height: '487px',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
          }}
        >
           <Typography variant="h6">Repeat option for announce</Typography>
          <Box sx={{ mb: 3, width: '100%', textAlign: 'center' }}>
            <input
              type="number"
              value={repeatInterval}
              onChange={handleIntervalChange}
              placeholder="Repeat Interval"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: ' 50%' }}
            />
          </Box>
          <Box sx={{ mt: 'auto', display: 'flex', gap: 2, width: '100%', justifyContent: 'space-between' }}>
            <Button onClick={handleSave} variant="outlined" color="secondary" >
              Save
            </Button>
            <Button onClick={handleSaveWithoutRepeat} variant="outlined" color="secondary" >
              Save Without Repeat
            </Button>
            <Button onClick={handleRedo} variant="outlined" color="secondary" >
              Redo
            </Button>
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
};

export default RepeatAnnounce;
