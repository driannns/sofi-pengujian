import { combineReducers, configureStore } from "@reduxjs/toolkit";
import lecturerReducer from "./lecturerSlicer";
import sidangReducer from "./sidangSlicer";
import loadingReducer from "./loadingSlicer";
import dokumenLogReducer from "./dokumentLogSlicer";
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
  loading: loadingReducer,
  dokumenLog: dokumenLogReducer,
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
