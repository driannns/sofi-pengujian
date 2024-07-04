import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNotification = createAsyncThunk(
  "fetchNotification",
  async (authToken) => {
    try {
      const res = await axios.get(`/api/notification/user/get`, {
        headers: {
          Authorization: "Bearer " + authToken,
          "ngrok-skip-browser-warning": true,
        },
      });
      return res.data.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateNotification = createAsyncThunk(
  "updateNotification",
  async ({ authToken, id }) => {
    try {
      const res = await axios.patch(`/api/notification/update/${id}`, {
        headers: {
          Authorization: "Bearer " + authToken,
          "ngrok-skip-browser-warning": true,
        },
      });
      console.log(res);
      return res.data.data;
    } catch (error) {
      throw error;
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    isLoading: false,
    data: null,
    lastUpdated: null,
    error: null,
  },

  extraReducers: (builder) => {
    builder.addCase(fetchNotification.pending, (state) => {
      state.error = null;
      state.isLoading = true;
    });
    builder.addCase(fetchNotification.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchNotification.rejected, (state) => {
      localStorage.setItem("errorMessage", "Network Error");
      state.error = true;
      state.data = null;
    });
    builder.addCase(updateNotification.pending, (state) => {
      state.error = null;
      state.isLoading = true;
    });
    builder.addCase(updateNotification.fulfilled, (state, action) => {
      state.isLoading = false;
      state.lastUpdated = action.payload;
    });
    builder.addCase(updateNotification.rejected, (state) => {
      localStorage.setItem("errorMessage", "Network Error");
      state.error = true;
      state.lastUpdated = null;
    });
  },
});

export default notificationSlice.reducer;
