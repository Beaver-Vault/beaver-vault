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
      console.log(action.payload);
      state.passwords = action.payload;
    },
    setCreditCards: (state, action) => {
      console.log(action.payload);
      state.creditCards = action.payload;
    },
    setNotes: (state, action) => {
      console.log(action.payload);
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

export const { setFolders, setPasswords, setCreditCards, setNotes, clearInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;
