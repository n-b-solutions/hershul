import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { IconButton, TextField, InputAdornment, Dialog } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface Message {
  id: string;
  messages: string;
}

const messages = [
  { id: 'USR-010', messages: 'Alcides Antonio' },
  { id: 'USR-003', messages: 'Carson Darrin' },
  { id: 'USR-005', messages: 'Fran Perez' },
  { id: 'USR-006', messages: 'Iulia Albu' },
  { id: 'USR-008', messages: 'Jie Yan' },
  { id: 'USR-009', messages: 'Marcus Finn' },
  { id: 'USR-001', messages: 'Miron Vitold' },
  { id: 'USR-007', messages: 'Nasimiyu Danai' },
  { id: 'USR-011', messages: 'Omar Darobe' },
  { id: 'USR-004', messages: 'Penjani Inyene' },
  { id: 'USR-002', messages: 'Siegbert Gottfried' },
] satisfies Message[];

export function SystemMessages(props: { open: boolean; handleClose: () => void }): React.JSX.Element {
  const { open, handleClose } = props;
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const filteredMessages = messages.filter((contact) =>
    contact.messages.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      BackdropProps={{ invisible: true }} // Makes the backdrop invisible
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
            <List disablePadding sx={{ '& .MuiListItemButton-root': { borderRadius: 1 } }}>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((contact) => (
                  <ListItem disablePadding key={contact.id}>
                    <ListItemButton>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography noWrap variant="subtitle2">
                            {contact.messages}
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
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
            <IconButton>
              <PlusIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
}
