import { createSlice } from "@reduxjs/toolkit";

export const uiStatusSlice = createSlice({
  name: "uiStatus",
  initialState: {
    currentFolder: null,
    currentEntry: null,
  },
  reducers: {
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
    setCurrentEntry: (state, action) => {
      state.currentEntry = action.payload;
    },
  },
});

export const { setCurrentEntry, setCurrentFolder } = uiStatusSlice.actions;

export default uiStatusSlice.reducer;
