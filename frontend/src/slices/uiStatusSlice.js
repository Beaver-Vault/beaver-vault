import { createSlice } from "@reduxjs/toolkit";
import { EntryTypes } from "../scripts/EntryTypes";

export const uiStatusSlice = createSlice({
  name: "uiStatus",
  initialState: {
    currentFolder: null,
    currentEntry: null,
    currentEntryType: EntryTypes.PASSWORD,
  },
  reducers: {
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
    setCurrentEntry: (state, action) => {
      state.currentEntry = action.payload;
    },
    setCurrentEntryType: (state, action) => {
      state.currentEntryType = action.payload;
    },
  },
});

export const { setCurrentEntry, setCurrentFolder, setCurrentEntryType } =
  uiStatusSlice.actions;

export default uiStatusSlice.reducer;
