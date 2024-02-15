import styled from "@emotion/styled";
import { Toolbar, IconButton, Typography, Theme } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../Context";
import { Test } from "../Test";

const drawerWidth: number = 240;

const Bar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }: { theme?: Theme; open: boolean }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function AppBar({ open, toggleDrawer }) {
  const navigate = useNavigate();
  const { data, setData } = useContext(DataContext);
  console.log({ data });
  const onClick = () => {
    navigate("/");
  };
  return (
    <>
      <Bar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={onClick}
          >
            ChartZoo
          </Typography>
          <Test />
        </Toolbar>
      </Bar>
    </>
  );
}
