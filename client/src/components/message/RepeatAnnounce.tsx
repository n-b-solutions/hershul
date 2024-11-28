import React, { useState } from 'react';
import { Box, Button, Dialog, IconButton, Paper, SelectChangeEvent, Typography } from '@mui/material';
import { X as CloseIcon } from '@phosphor-icons/react/dist/ssr/X';

const RepeatAnnounce = ({ onFinish }: { onFinish: (id?: string) => void }) => {
  console.log('RepeatAnnounce');

  const [repeatInterval, setRepeatInterval] = useState(0);

  const handleSave = () => {
    console.log('Save clicked');
    onFinish();
  };

  const handleSaveWithoutRepeat = () => {
    console.log('Save Without Repeat clicked');
    onFinish();
  };

  const handleRedo = () => {
    console.log('Redo clicked');
    onFinish();
  };

  const handleIntervalChange = (event: SelectChangeEvent<any>) => {
    setRepeatInterval(event.target.value);
  };

  return (
    <Box sx={{ bgcolor: 'transparent', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        <Button onClick={handleSave} variant="outlined" color="secondary">
          Save
        </Button>
        <Button onClick={handleSaveWithoutRepeat} variant="outlined" color="secondary">
          Save Without Repeat
        </Button>
        <Button onClick={handleRedo} variant="outlined" color="secondary">
          Redo
        </Button>
      </Box>
    </Box>
  );
};

export default RepeatAnnounce;
