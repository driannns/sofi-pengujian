import axios from "axios";
export const FETCH_SIDANG_REQUEST = "FETCH_SIDANG_REQUEST";
export const FETCH_SIDANG_SUCCESS = "FETCH_SIDANG_SUCCESS";
export const FETCH_SIDANG_FAILURE = "FETCH_SIDANG_FAILURE";
import { useNavigate } from "react-router-dom";

const APIURL = "https://d875-36-65-247-251.ngrok-free.app/api";

const fetSidangRequest = () => {
  return {
    type: FETCH_SIDANG_REQUEST,
  };
};

const fetSidangSuccess = (data) => {
  return {
    type: FETCH_SIDANG_SUCCESS,
    payload: {
      data: data,
    },
  };
};

const fetSidangFailure = (error) => {
  return {
    type: FETCH_SIDANG_FAILURE,
    payload: error,
  };
};

export const createSidang = ({
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
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("nim", nim);
      formData.append("pembimbing1_id", pembimbing1);
      formData.append("pembimbing2_id", pembimbing2);
      formData.append("judul", judul);
      formData.append("eprt", eprt);
      formData.append("doc_ta", docTA);
      formData.append("makalah", makalah);
      formData.append("tak", tak);
      formData.append("period_id", periodId);
      formData.append("form_bimbingan1", totalguidance_advisor1);
      formData.append("form_bimbingan2", totalguidance_advisor2);
      formData.append("peminatan", peminatanId);
      dispatch(fetSidangRequest());
      const res = await axios.post(`${APIURL}/pengajuan/create`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(fetSidangSuccess(res.data.data));
    } catch (err) {
      dispatch(fetSidangFailure(err));
    }
  };
};

export const checkSidang = (authToken) => {
  return async (dispatch) => {
    try {
      dispatch(fetSidangRequest());
      const res = await axios.get(`${APIURL}/pengajuan/check-user`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "ngrok-skip-browser-warning": true,
        },
      });
      dispatch(fetSidangSuccess(res.data));
    } catch (err) {
      dispatch(fetSidangFailure(err));
    }
  };
};
