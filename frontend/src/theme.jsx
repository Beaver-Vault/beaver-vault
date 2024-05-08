import { createTheme } from "@mui/material/styles";

export const mainTheme = createTheme({
  palette: {
    primary: {
      main: "#ff7001",
      light: "#ffb780",
      dark: "#CC5900",
    },
    grey: {
      400: "#cccccc",
      500: "#808080",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "'Raleway', sans-serif",
    button: {
      textTransform: "none",
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
});
