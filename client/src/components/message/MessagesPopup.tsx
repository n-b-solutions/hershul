import * as React from 'react';
import { messageLoading, selectMessages, selectPopupState } from '@/redux/message/messageSlice';
import { closePopup, fetchMessages } from '@/redux/message/messageThunk';
import type { AppDispatch } from '@/redux/store';
import { Dialog, IconButton, InputAdornment, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { X as CloseIcon } from '@phosphor-icons/react/dist/ssr/X';
import { useDispatch, useSelector } from 'react-redux';

import { CreateMessagePopup } from './CreateMessagePopup';

export function MessagesPopup(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const messagesSlice = useSelector(selectMessages);
  const popupState = useSelector(selectPopupState);
  const loading = useSelector(messageLoading);

  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (popupState.open) {
      dispatch(fetchMessages());
    }
  }, [dispatch, popupState.open]);

  const handleCreateDialogOpen = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateDialogClose = (messageId?: string) => {
    dispatch(closePopup(messageId ?? ''));
  };

  const handleItemClick = (message: string, messageId?: string) => {
    dispatch(closePopup(messageId ?? ''));
  };

  const filteredMessages = messagesSlice.filter(
    (contact) =>
      contact.name &&
      contact.selectedRoom === popupState.roomName &&
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
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
        open={popupState.open}
        onClose={() => handleCreateDialogClose()}
        onClick={(event) => event.stopPropagation()}
      >
        <Box sx={{ bgcolor: 'transparent', p: 0, display: 'flex', justifyContent: 'center' }}>
          <Paper
            sx={{
              border: '1px solid var(--mui-palette-divider)',
              boxShadow: 'var(--mui-shadows-16)',
              width: '320px',
              mx: 'auto',
              position: 'relative',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
              <Typography variant="h6">Messages</Typography>
              <IconButton sx={{ color: 'red', fontSize: '1rem' }} onClick={() => handleCreateDialogClose()}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ px: 3, py: 2 }}>
              <TextField
                fullWidth
                placeholder="Search..."
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mt: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MagnifyingGlassIcon size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ height: '320px', overflowY: 'auto', px: 1, pb: 2 }}>
              {loading ? (
                <Typography sx={{ px: 2, py: 1 }} variant="subtitle2" color="textSecondary">
                  Loading...
                </Typography>
              ) : (
                <List disablePadding sx={{ '& .MuiListItemButton-root': { borderRadius: 1 } }}>
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map((contact) => (
                      <ListItem disablePadding key={contact.id}>
                        <ListItemButton onClick={() => handleItemClick(contact.name, contact.id)}>
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography noWrap variant="subtitle2">
                                {contact.name}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))
                  ) : (
                    <Typography sx={{ px: 2, py: 1 }} variant="subtitle2" color="textSecondary">
                      No matching results
                    </Typography>
                  )}
                </List>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <IconButton onClick={handleCreateDialogOpen}>
                <PlusIcon />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Dialog>

      <CreateMessagePopup
        open={isCreateDialogOpen}
        handleClose={(messageId?: string) => handleCreateDialogClose(messageId)}
        room={popupState.roomName}
      />
    </>
  );
}
