import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { lecturerReducer } from "./modules/lecturer/reducer";

const rootReducer = combineReducers({
  lecturer: lecturerReducer,
});
const middleware = [thunk];

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

export default store;
