import { createSlice } from "@reduxjs/toolkit";

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    folders: [],
    passwords: [],
    creditCards: [],
    notes: [],
  },
  reducers: {
    setFolders: (state, action) => {
      state.folders = action.payload;
    },
    setPasswords: (state, action) => {
      state.passwords = action.payload;
    },
    setCreditCards: (state, action) => {
      state.creditCards = action.payload;
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    clearInfo: (state) => {
      state.folders = [];
      state.passwords = [];
      state.creditCards = [];
      state.notes = [];
    },
  },
});

export const { setFolders, setPasswords, setCreditCards, setNotes, clearInfo } =
  userInfoSlice.actions;

export default userInfoSlice.reducer;
