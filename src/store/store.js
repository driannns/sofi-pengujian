import { combineReducers, configureStore } from "@reduxjs/toolkit";
import lecturerReducer from "./lecturerSlicer";
import sidangReducer from "./sidangSlicer";
import dokumenLogReducer from "./dokumentLogSlicer";
import notificationReducer from "./notificationSlicer";
import scheduleReducer from "./scheduleSlicer";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const rootReducer = combineReducers({
  lecturer: lecturerReducer,
  sidang: sidangReducer,
  dokumenLog: dokumenLogReducer,
  notification: notificationReducer,
  schedule: scheduleReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
