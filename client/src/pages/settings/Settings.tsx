import * as React from 'react';
import { typesOfDates } from '@/const/minyans.const';
import { setCurrentDateType } from '@/redux/minyans/setting-times-slice';
import { RootState } from '@/redux/store';
import { Grid, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Table, Clock, List as Menu } from '@phosphor-icons/react';

import type { Metadata } from '@/types/metadata.type';

import { MinyansSettings } from './components/minyans-settings/MinyansSettings';

const metadata: Metadata = { title: 'Setting' };

export const Settings = (): React.JSX.Element => {
  const [open, setOpen] = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: open ? 240 : 60,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? 240 : 60,
              boxSizing: 'border-box',
              transition: 'width 0.3s',
            },
          }}
        >
          <List>
            <ListItem button onClick={handleDrawerToggle}>
              <ListItemIcon>
                <Menu size={24} />
              </ListItemIcon>
            </ListItem>
            <ListItem button selected={selectedTab === 0} onClick={() => handleTabChange(0)}>
              <ListItemIcon>
                <Table size={24} />
              </ListItemIcon>
              {open && <ListItemText primary="Minyans Settings" />}
            </ListItem>
            <ListItem button selected={selectedTab === 1} onClick={() => handleTabChange(1)}>
              <ListItemIcon>
                <Clock size={24} />
              </ListItemIcon>
              {open && <ListItemText primary="Times Settings" />}
            </ListItem>
            <ListItem button selected={selectedTab === 2} onClick={() => handleTabChange(2)}>
              <ListItemIcon>
                <Clock size={24} />
              </ListItemIcon>
              {open && <ListItemText primary="Global Settings" />}
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container sx={{ width: '100%', height: '100%' }}>
            <Grid item xs={12} sx={{ height: '100%' }}>
              {selectedTab === 0 && <MinyansSettings />}
              {selectedTab === 1 && <div>Times Settings Content</div>}
              {selectedTab === 2 && <div>Global Settings Content</div>}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
