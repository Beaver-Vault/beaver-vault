import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userInfoReducer from "../slices/userInfoSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    userInfo: userInfoReducer,
  },
});
