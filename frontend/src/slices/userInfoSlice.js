import { createSlice } from "@reduxjs/toolkit";

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    folders: [],
    passwords: [],
  },
  reducers: {
    setFolders: (state, action) => {
      state.folders = action.payload;
    },
    setPasswords: (state, action) => {
      console.log(action.payload);
      state.passwords = action.payload;
    },
    clearInfo: (state) => {
      state.folders = [];
      state.passwords = [];
    },
  },
});

export const { setFolders, setPasswords, clearInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;
