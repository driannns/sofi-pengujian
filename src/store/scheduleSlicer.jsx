import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiBaseURL = "http://34.128.116.66:8080/api/schedule";

export const getAllSchedules = createAsyncThunk(
  "getAllSchedules",
  async ({ authToken, role }, thunkAPI) => {
    try {
      let apiEndpoint;

      if (role.includes("RLPIC")) {
        apiEndpoint = `${apiBaseURL}/get`;
      } else if (role.includes("RLADM")) {
        apiEndpoint = `${apiBaseURL}/admin/get`;
      } else if (role.includes("RLADM_BEFORE")) {
        apiEndpoint = `${apiBaseURL}/admin-before/get`;
      } else if (role.includes("RLSUP")) {
        apiEndpoint = `${apiBaseURL}/superadmin/get`;
      } else if (role.includes("RLPGJ")) {
        apiEndpoint = `${apiBaseURL}/penguji/get`;
      } else if (role.includes("RLPBB")) {
        apiEndpoint = `${apiBaseURL}/pembimbing/get`;
      } else if (role.includes("RLMHS")) {
        apiEndpoint = "http://34.101.130.40:8080/api/schedule/mahasiswa/get";
      } else {
        return thunkAPI.rejectWithValue("Role tidak dikenal");
      }

      const res = await axios.get(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.data.code === 200) {
        return res.data.data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const getScheduleDetail = createAsyncThunk(
  "getScheduleDetail",
  async ({scheduleId, authToken}) => {
    try {
      const res = await axios.get(`${apiBaseURL}/pengajuan/get/${scheduleId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.data.code === 200) {
        return res.data.data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const createSchedule = createAsyncThunk(
  "createSchedule",
  async (
    { date, time, room, penguji1, penguji2, teams, authToken }
  ) => {
    try {
      const userDate = new Date(date + "T" + time);
      const utcDate = new Date(
        userDate.getTime() - userDate.getTimezoneOffset() * 60000
      );
      const dateTime = utcDate.toISOString().split(".")[0] + "Z";

      const data = {
        date_time: dateTime,
        room,
        penguji1,
        penguji2,
        members: teams.members.map((member) => ({
          user_id: member.user_id,
          pengajuan_id: member.pengajuan_id,
          pembimbing1_id: member.pengajuan.pembimbing1_id,
          pembimbing2_id: member.pengajuan.pembimbing2_id,
          kk: member.pengajuan.kk,
        })),
      };

      const res = await axios.post(`${apiBaseURL}/create`, data, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("successMessage", "Jadwal Berhasil Dibuat.");
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

export const updateSchedule = createAsyncThunk(
  "updateSchedule",
  async (
    { date, time, room, penguji1, penguji2, teams, scheduleId, authToken }
  ) => {
    try {
      const userDate = new Date(date + "T" + time);
      const utcDate = new Date(
        userDate.getTime() - userDate.getTimezoneOffset() * 60000
      );
      const dateTime = utcDate.toISOString().split(".")[0] + "Z";

      const data = {
        date_time: dateTime,
        room,
        penguji1,
        penguji2,
        members: teams.members.map((member) => ({
          user_id: member.user_id,
          pengajuan_id: member.pengajuan_id,
          pembimbing1_id: member.pengajuan.pembimbing1_id,
          pembimbing2_id: member.pengajuan.pembimbing2_id,
          kk: member.pengajuan.kk,
        })),
      };

      const res = await axios.patch(
        `${apiBaseURL}/update/${scheduleId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("successMessage", "Jadwal Berhasil Diperbarui.");
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

export const deleteSchedule = createAsyncThunk(
  "deleteSchedule",
  async ({ scheduleId, authToken }) => {
    try {
      const res = await axios.delete(`${apiBaseURL}/delete/${scheduleId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.data.code === 200) {
        return res.data.data;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const addFlag = createAsyncThunk(
  "addFlag",
  async ({ scheduleId, code, authToken }) => {
    try {
      const res = await axios.post(
        `${apiBaseURL}/change-flag/${scheduleId}`,
        null,
        {
          params: { code },
          headers: {
            Authorization: `Bearer ${authToken}`,
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

const penjadwalanSlice = createSlice({
  name: "penjadwalan",
  initialState: {
    loading: false,
    schedules: [],
    scheduleDetail: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(getAllSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getScheduleDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getScheduleDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.scheduleDetail = action.payload;
      })
      .addCase(getScheduleDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules.push(action.payload);
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.schedules.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(
          (s) => s.id !== action.payload
        );
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addFlag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFlag.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.schedules.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
      })
      .addCase(addFlag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default penjadwalanSlice.reducer;
