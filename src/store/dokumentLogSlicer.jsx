import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const uploadSlide = createAsyncThunk(
  "uploadSlide",
  async ({ authToken, slide }) => {
    try {
      const res = await axios.post(
        `/api/documentLog/create/slide`,
        { slide },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      localStorage.setItem(
        "successMessage",
        "Berhasil mengupload slide presentasi, silahkan buat team jika belum membuat team. PERHATIAN : Slide presentasi dapat diubah sebelum sidang anda telah dijadwalkan!"
      );
      return res.data.data;
    } catch (error) {
      localStorage.setItem("errorMessage", error.response.data.message);
      throw new Error(error.response.data.message);
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
    builder.addCase(uploadSlide.rejected, (state, action) => {
      console.log(action);
      state.data = null;
      state.error = action.error.message;
    });
  },
});

export default dokumenLogSlice.reducer;
