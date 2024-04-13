import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLecturer = createAsyncThunk("fetchLecturer", async () => {
  try {
    const res = await axios.get(`https://sofi.my.id/api/lecturer`);
    if (res.data.code === 200) {
      return res.data.data;
    }
  } catch (error) {
    throw error;
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
      state.error = false;
      state.isLoading = true;
    });
    builder.addCase(fetchLecturer.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchLecturer.rejected, (state) => {
      localStorage.setItem("errorMessage", "Network Error");
      state.error = true;
    });
  },
});

export default lecturerSlice.reducer;
