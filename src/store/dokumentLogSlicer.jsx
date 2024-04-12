import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { isLoadingTrue, isLoadingFalse } from "./loadingSlicer";

export const uploadSlide = createAsyncThunk(
  "uploadSlide",
  async ({ authToken, slide }, thunkAPI) => {
    try {
      thunkAPI.dispatch(isLoadingTrue());
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/slide/create-slide`,
        { slide },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      console.log(res.data);
      localStorage.setItem(
        "successMessage",
        "Berhasil mengupload slide presentasi, silahkan buat team jika belum membuat team. PERHATIAN : Slide presentasi dapat diubah sebelum sidang anda telah dijadwalkan!"
      );
      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      thunkAPI.dispatch(isLoadingFalse());
    }
  }
);

const dokumenLogSlice = createSlice({
  name: "dokumenLog",
  initialState: {
    data: null,
    error: false,
  },

  extraReducers: (builder) => {
    builder.addCase(uploadSlide.pending, (state) => {
      state.data = null;
      state.error = false;
    });
    builder.addCase(uploadSlide.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(uploadSlide.rejected, (state) => {
      state.data = null;
      state.error = true;
    });
  },
});

export default dokumenLogSlice.reducer;
