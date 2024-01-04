import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from './AppBar';
import Drawer from './Drawer';
import MainView from './MainView';
import { Outlet } from 'react-router-dom';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar open={open} toggleDrawer={toggleDrawer}></AppBar>
        <Drawer open={open} toggleDrawer={toggleDrawer}></Drawer>
        <MainView>
          <Outlet></Outlet>
        </MainView>
      </Box>
    </ThemeProvider>
  );
}