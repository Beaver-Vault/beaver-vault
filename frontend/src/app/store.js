import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

import authReducer from "../slices/authSlice";
import userInfoReducer from "../slices/userInfoSlice";
import { apiSlice } from "../slices/apiSlice";
import uiStatusSlice from "../slices/uiStatusSlice";
import snackbarSlice from "../slices/snackbarSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  userInfo: userInfoReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  uiStatus: uiStatusSlice,
  snackbar: snackbarSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(apiSlice.middleware),
});

const persistor = persistStore(store);

export { store, persistor };
