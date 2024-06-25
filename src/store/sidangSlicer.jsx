import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { eachQuarterOfInterval } from "date-fns";

export const getAllSidang = createAsyncThunk(
  "getAllSidang",
  async (authToken) => {
    try {
      const res = await axios.get(`/api/pengajuan/get`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "ngrok-skip-browser-warning": true,
        },
      });
      if (res.data.code === 200) {
        return res.data.data;
      }
    } catch (error) {
      console.log(error.response);
      throw error;
    }
  }
);

export const getPICSidang = createAsyncThunk(
  "getPICSidang",
  async (authToken) => {
    try {
      const res = await axios.get(`/api/pengajuan/pic/get`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "ngrok-skip-browser-warning": true,
        },
      });
      if (res.data.code === 200) {
        return res.data.data;
      }
    } catch (error) {
      throw error;
    }
  }
);

export const getPembimbingSidang = createAsyncThunk(
  "getPembimbingSidang",
  async (authToken) => {
    try {
      const res = await axios.get(`/api/pengajuan/pembimbing/get`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "ngrok-skip-browser-warning": true,
        },
      });
      if (res.data.code === 200) {
        return res.data.data;
      }
    } catch (error) {
      throw error;
    }
  }
);

export const getSidangById = createAsyncThunk(
  "getSidangById",
  async ({ authToken, sidangId }) => {
    try {
      const res = await axios.get(`/api/pengajuan/get/${sidangId}`, {
        headers: { Authorization: "Bearer " + authToken },
      });
      if (res.data.code === 200) {
        return res.data.data;
      }
    } catch (error) {
      throw error;
    }
  }
);

export const getSidangByPeriod = createAsyncThunk(
  "getSidangByPeriod",
  async (authToken, period) => {
    try {
      const res = await axios.get(`/api/period/get/${period}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return res.data.data;
    } catch (error) {
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

      const res = await axios.post(`/api/pengajuan/create`, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": true,
        },
      });
      localStorage.setItem("successMessage", "Sidang Berhasil Disimpan.");
      return res.data.data;
    } catch (error) {
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

      const res = await axios.patch(`/api/pengajuan/update/${sidangId}`, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": true,
        },
      });
      localStorage.setItem("successMessage", "Sidang berhasil diedit");
      return res.data.data;
    } catch (error) {
      if (error.response.data.message) {
        localStorage.setItem("errorMessage", error.response.data.message);
        throw error.response.data.message;
      }
    }
  }
);

export const checkSidang = createAsyncThunk(
  "checkSidang",
  async (authToken) => {
    try {
      const res = await axios.get(`/api/pengajuan/user/get`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "ngrok-skip-browser-warning": true,
        },
      });
      console.log(res);
      if (res.data.code === 200) {
        return res.data.data;
      }
    } catch (error) {
      console.log(error.response);
      if (error.message === "Network Error") {
        throw error;
      }
      throw new Error(error.response.data.message);
    }
  }
);

export const feedbackSidang = createAsyncThunk(
  "feedbackSidang",
  async ({ authToken, feedback, sidangId }, thunkAPI) => {
    try {
      const res = await axios.patch(
        `/api/pengajuan/rejected/${sidangId}`,
        { feedback: feedback },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      if (res.data.code === 200) {
        localStorage.setItem("successMessage", "Feedback Sudah Dikirim");
      }
      thunkAPI.dispatch(getAllSidang(authToken));
    } catch (error) {
      throw error;
    }
  }
);

export const approveFeedbackSidang = createAsyncThunk(
  "approveFeedbackSidang",
  async ({ authToken, feedbackApprove, bahasa, sidangId }, thunkAPI) => {
    try {
      const isEnglish = bahasa === "true" ? true : false;
      const res = await axios.patch(
        `/api/pengajuan/approve/${sidangId}`,
        { feedback: feedbackApprove, is_english: isEnglish },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      thunkAPI.dispatch(getAllSidang(authToken));
    } catch (error) {
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
      state.data = null;
      state.error = null;
    });
    builder.addCase(getAllSidang.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getAllSidang.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getPICSidang.pending, (state) => {
      state.loading = true;
      state.data = null;
      state.error = null;
    });
    builder.addCase(getPICSidang.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getPICSidang.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getPembimbingSidang.pending, (state) => {
      state.loading = true;
      state.data = null;
      state.error = null;
    });
    builder.addCase(getPembimbingSidang.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getPembimbingSidang.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(getSidangById.pending, (state) => {
      state.loading = true;
      state.data = null;
      state.error = null;
    });
    builder.addCase(getSidangById.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getSidangById.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(getSidangByPeriod.pending, (state) => {
      state.loading = true;
      state.data = null;
      state.error = null;
    });
    builder.addCase(getSidangByPeriod.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getSidangByPeriod.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
    builder.addCase(createSidang.pending, (state) => {
      state.loading = true;
      state.data = null;
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
      state.data = null;
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
    builder.addCase(checkSidang.pending, (state) => {
      state.loading = true;
      state.data = null;
    });
    builder.addCase(checkSidang.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(checkSidang.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(feedbackSidang.fulfilled, (state) => {
      state.error = true;
    });
    builder.addCase(feedbackSidang.rejected, (state) => {
      state.error = true;
    });
    builder.addCase(approveFeedbackSidang.fulfilled, (state, action) => {
      state.error = true;
    });
    builder.addCase(approveFeedbackSidang.rejected, (state) => {
      state.error = true;
    });
  },
});

export default sidangSlice.reducer;
