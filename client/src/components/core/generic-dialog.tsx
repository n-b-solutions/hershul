import * as React from 'react';
import { Dialog, IconButton, Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { X as CloseIcon } from '@phosphor-icons/react/dist/ssr/X';

interface GenericDialogProps {
  open: boolean;
  handleClose: (id?: string) => void;
  header?: string;
  children: React.ReactNode;
}

export const GenericDialog = ({ open, handleClose, children, header }: GenericDialogProps): React.ReactElement => {
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
      onClose={() => handleClose()}
      onClick={(event) => event.stopPropagation()}
    >
      <Box
        sx={{
          backgroundColor: 'transparent',
          p: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            border: '1px solid var(--mui-palette-divider)',
            boxShadow: 'var(--mui-shadows-16)',
            width: '320px',
            minHeight: '537px',
            maxHeight: '537px',
            mx: 'auto',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
            <Typography variant="h6">{header}</Typography>
            <IconButton sx={{ color: 'red', fontSize: '1rem' }} onClick={() => handleClose()}>
              <CloseIcon />
            </IconButton>
          </Box>
          {children}
        </Paper>
      </Box>
    </Dialog>
  );
};
