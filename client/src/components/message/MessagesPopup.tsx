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

import ManagingSteps from './ManagingSteps';

export function MessagesPopup({ onFinish }: { onFinish: (messageId?: string) => void }): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const popupState = useSelector(selectPopupState);
  const messagesSlice = useSelector(selectMessages);
  const loading = useSelector(messageLoading);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (popupState.open) {
      dispatch(fetchMessages());
    }
  }, [dispatch, popupState.open]);

  const filteredMessages = messagesSlice.filter(
    (contact) =>
      contact.name &&
      contact.selectedRoom === popupState.roomName &&
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
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
                  <ListItemButton onClick={() => onFinish(contact.id)}>
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
        <IconButton onClick={() => onFinish()}>
          <PlusIcon />
        </IconButton>
      </Box>
    </>
  );
}
