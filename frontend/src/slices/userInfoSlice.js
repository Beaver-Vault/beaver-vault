import { createSlice } from "@reduxjs/toolkit";

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    folders: [],
  },
  reducers: {
    setFolders: (state, action) => {
      state.folders = action.payload;
    },
  },
});

export const { setFolders } = userInfoSlice.actions;

export default userInfoSlice.reducer;
