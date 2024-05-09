import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userInfoReducer from "../slices/userInfoSlice";
import { apiSlice } from "../slices/apiSlice";
import uiStatusSlice from "../slices/uiStatusSlice";
import snackbarSlice from "../slices/snackbarSlice";

export default configureStore({
  reducer: {
    uiStatus: uiStatusSlice,
    auth: authReducer,
    userInfo: userInfoReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    snackbar: snackbarSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
