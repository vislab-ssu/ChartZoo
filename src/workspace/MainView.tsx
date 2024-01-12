import { Box, Container, Grid, Paper, Toolbar } from "@mui/material";

export default function MainView({ children }) {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <Container maxWidth={false} sx={{ mt: 4, mb: 4, minWidth: 'fit-content' }}>
        <Grid container spacing={3} sx={{ height: "90vh" }}>
          {/* Chart */}
          <Grid item xs={10} md={12} lg={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
            >
              {children}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
