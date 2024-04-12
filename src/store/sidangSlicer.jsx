import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllSidang = createAsyncThunk(
  "getAllSidang",
  async (authToken) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pengajuan/get`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      if (res.data.code === 200) {
        return res.data.data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const createSidang = createAsyncThunk(
  "createSidang",
  async ({
    nim,
    pembimbing1,
    pembimbing2,
    judul,
    eprt,
    docTA,
    makalah,
    tak,
    periodId,
    totalguidance_advisor1,
    totalguidance_advisor2,
    peminatanId,
    authToken,
  }) => {
    try {
      const data = {
        nim,
        pembimbing1_id: pembimbing1,
        pembimbing2_id: pembimbing2,
        judul,
        eprt,
        doc_ta: docTA,
        makalah,
        tak,
        period_id: periodId,
        form_bimbingan1: totalguidance_advisor1,
        form_bimbingan2: totalguidance_advisor2,
        peminatan: peminatanId,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pengajuan/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      localStorage.setItem("successMessage", "Sidang Berhasil Disimpan.");
      return res.data.data;
    } catch (error) {
      console.log(error);
      if (error.response.data.message) {
        localStorage.setItem("errorMessage", error.response.data.message);
        throw error.response.data.message;
      }
    }
  }
);

export const updateSidang = createAsyncThunk(
  "updateSidang",
  async ({
    nim,
    pembimbing1,
    pembimbing2,
    judul,
    eprt,
    docTA,
    makalah,
    tak,
    periodId,
    totalguidance_advisor1,
    totalguidance_advisor2,
    peminatanId,
    sidangId,
    authToken,
  }) => {
    try {
      const data = {
        nim,
        pembimbing1_id: pembimbing1,
        pembimbing2_id: pembimbing2,
        judul,
        eprt,
        doc_ta: docTA,
        makalah,
        tak,
        period_id: periodId,
        form_bimbingan1: totalguidance_advisor1,
        form_bimbingan2: totalguidance_advisor2,
        peminatan: peminatanId,
      };

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/pengajuan/update/${sidangId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      localStorage.setItem("successMessage", "Sidang berhasil diedit");
      return res.data.data;
    } catch (error) {
      if (error.response.data.message) {
        localStorage.setItem("errorMessage", error.response.data.message);
        throw error.response.data.message;
      }
      console.log(error.response);
    }
  }
);

export const checkSidang = createAsyncThunk(
  "checkSidang",
  async (authToken) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pengajuan/check-user`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );

      if (res.data.code === 200) {
        return res.data.data;
      }
    } catch (error) {
      throw error.response;
    }
  }
);

export const feedbackSidang = createAsyncThunk(
  "feedbackSidang",
  async ({ authToken, feedback, sidangId }, thunkAPI) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/pengajuan/rejected/${sidangId}`,
        { feedback: feedback },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      console.log(res);
      if (res.data.code === 200) {
        localStorage.setItem("successMessage", "Feedback Sudah Dikirim");
      }
      thunkAPI.dispatch(getAllSidang(authToken));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const approveFeedbackSidang = createAsyncThunk(
  "approveFeedbackSidang",
  async ({ authToken, feedbackApprove, bahasa, sidangId }, thunkAPI) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/pengajuan/approve/${sidangId}`,
        { feedback: feedbackApprove, is_english: bahasa },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      console.log(res);
      thunkAPI.dispatch(getAllSidang(authToken));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const sidangSlice = createSlice({
  name: "sidang",
  initialState: {
    loading: false,
    data: null,
    error: null,
  },

  extraReducers: (builder) => {
    builder.addCase(getAllSidang.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllSidang.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getAllSidang.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(createSidang.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSidang.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(createSidang.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateSidang.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateSidang.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(updateSidang.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(checkSidang.fulfilled, (state, action) => {
      state.data = action.payload;
    });
    builder.addCase(checkSidang.rejected, (state) => {
      state.error = true;
    });
    // builder.addCase(feedbackSidang.fulfilled, (state) => {
    //   state.error = true;
    // });
    builder.addCase(feedbackSidang.rejected, (state) => {
      state.error = true;
    });
    // builder.addCase(approveFeedbackSidang.fulfilled, (state, action) => {
    //   state.error = true;
    // });
    builder.addCase(approveFeedbackSidang.rejected, (state) => {
      state.error = true;
    });
  },
});

export default sidangSlice.reducer;
