import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userInfoReducer from "../slices/userInfoSlice";
import { apiSlice } from "../slices/apiSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    userInfo: userInfoReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
