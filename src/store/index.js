import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { lecturerReducer } from "./modules/lecturer/reducer";
import { sidangReducer } from "./modules/sidang/reducer";

const rootReducer = combineReducers({
  lecturer: lecturerReducer,
  sidang: sidangReducer,
});
const middleware = [thunk];

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

export default store;
