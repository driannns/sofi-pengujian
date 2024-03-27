import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLecturer = createAsyncThunk("fetchLecturer", async () => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/lecturer");
    return res.data.data;
  } catch (error) {
    return error;
  }
});

const lecturerSlice = createSlice({
  name: "lecturer",
  initialState: {
    isLoading: false,
    data: null,
    error: null,
  },

  extraReducers: (builder) => {
    builder.addCase(fetchLecturer.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLecturer.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchLecturer.rejected, (state) => {
      state.error = true;
    });
  },
});

export default lecturerSlice.reducer;
