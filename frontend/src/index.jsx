import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./app/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { mainTheme } from "./theme";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider theme={mainTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
