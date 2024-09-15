import * as React from 'react';
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
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchMessageRooms,
  selectMessageRoomLoading,
  selectMessageRooms,
} from '../../../state/message-room/message-room-slice';
import type { AppDispatch } from '../../../state/store'; // ייבוא AppDispatch

import { CreateSystemMessages } from './createSystemMessages';

export function SystemMessages(props: { open: boolean; handleClose: () => void; room: string }): React.JSX.Element {
  const { open, handleClose, room } = props;
  const dispatch = useDispatch<AppDispatch>(); // שימוש ב-AppDispatch

  const messages = useSelector(selectMessageRooms);
  const loading = useSelector(selectMessageRoomLoading);

  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (open) {
      dispatch(fetchMessageRooms());
    }
  }, [dispatch, open]);

  const handleCreateDialogOpen = () => {
    handleClose();
    setIsCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
  };

  const handleItemClick = (message: string) => {
    console.log(`Clicked on : ${message}`);
    handleClose();
  };

  const filteredMessages = messages.filter(
    (contact) =>
      contact.name &&
      contact.selectedRoom === room && // סינון לפי החדר הנוכחי
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
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ bgcolor: 'transparent', p: 0, display: 'flex', justifyContent: 'center' }}>
          <Paper
            sx={{
              border: '1px solid var(--mui-palette-divider)',
              boxShadow: 'var(--mui-shadows-16)',
              width: '320px',
              mx: 'auto',
            }}
          >
            <Box sx={{ px: 3, py: 2 }}>
              <Typography variant="h6">Messages</Typography>
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
                        <ListItemButton onClick={() => handleItemClick(contact.name)}>
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

      <CreateSystemMessages open={isCreateDialogOpen} handleClose={handleCreateDialogClose} />
    </>
  );
}
