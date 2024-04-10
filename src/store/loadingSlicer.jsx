import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const isLoadingTrue = createAsyncThunk("loadingIsTrue", async () => {
  return true;
});

export const isLoadingFalse = createAsyncThunk("loadingIsFalse", async () => {
  return false;
});

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    loading: false,
  },

  extraReducers: (builder) => {
    builder.addCase(isLoadingTrue.fulfilled, (state, action) => {
      state.loading = action.payload;
    });
    builder.addCase(isLoadingFalse.fulfilled, (state, action) => {
      state.loading = action.payload;
    });
  },
});

export default loadingSlice.reducer;
