import axios from "axios";

export const FETCH_LECTURER_REQUEST = "FETCH_LECTURER_REQUEST";
export const FETCH_LECTURER_SUCCESS = "FETCH_LECTURER_SUCCESS";
export const FETCH_LECTURER_FAILURE = "FETCH_LECTURER_FAILURE";

const tokenSSO =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiNWY5ZDdkNWQ3Yzk4MmYyYzc0YWIxZDRlN2Y3NjYzZTgwOWI1ZDJjNmQyNzI1YjYwNDBmNmExOTEwNjU3OGQ0OGUyZTViNWNkZWY1Njg0NTUiLCJpYXQiOjE3MDk0Nzg5OTUsIm5iZiI6MTcwOTQ3ODk5NSwiZXhwIjoxNzA5NTY1Mzk1LCJzdWIiOiJla2t5bm92cml6YWxhbSIsInNjb3BlcyI6WyJjZWxvZS1kYXNoYm9hcmQiLCJvbGQtZG9zZW4iLCJvbGQtZG9zZW4td2FsaSIsImFkbWlzc2lvbi1hZG1pbiIsImFkbWlzc2lvbi1kYXNoYm9hcmQtdXNlcnMiLCJhdHRlbmRhbmNlLWVtcGxveWVlIiwiZGFzaGJvYXJkLXVzZXIiLCJuZXctc3NvIiwib2xkLXBlZ2F3YWkiLCJzc28tb3BlbmxpYiIsInN0YWZmX3Rlc3Rfc3BzIiwib2xkLWtlbG9tcG9rLWtlYWhsaWFuIiwiZW1wbG95ZWUtc3RydWN0dXJhbCIsIm9sZC1hZG1pbi1yZWdpc3RyYXNpLWZha3VsdGFzIl19.XJzqUCwo-WeeB66awr5GPriV9qlJ8-B6nKAoKc0XjoNN2_I9pCwEH6UNPuDkLN8IAwOem8FNQc7EBfNHoTNGgyItmhRbtmK0KJnbz-27uEK-kryrW27BGKedT-U5iNC1FmiPQJ02-kDvq2loe7xTT7OT5b9wMJNePv1Xhb2SenGixIg6F5PHDbAUCn-mQ9kDV-LcHAKdNvZlbzHXUvv9cU2uH-XjqqK8918sWOMK-Qo_j4QBTWT2-br2icwlQDfSeHKwtjkgOIjfnDAEeeviipStWJDPLEIs0Rh90gQdBf4kj1Jhu74CSHlBAi6jK7axZflaCyMzr8tl3yGs-XKoWZTxuH8WvrC3DWJ-yom0Bo0t6BNTVjHkuSeOYJwGDYYep5bHex9wfAS9re6mcM3fWuqnSB0zDTBtmLfU5gsLqEAySmbjgPSJ-oujjP-ObNQFRYzLpn-NGnB1R5YueBLAGd9YFMPokzz5VzWXvTXdc6MYG7J0kuY6DbQ3KbrkemoUMXgs5RLSTf0C4CFKZs4Ki5V_lFIARm_f3CT5lE5pCKPE428psHa0F4WK63Pm39lADUKVYa7W_ibogYlmdOgm9R4g4lqnjFGnHLQPn_ZIuSrvTgpTzQjLs1qAsBDiybtKfpIhMU_6MExCWg--tKuF2Zyzu4zdcpEQSawFsLQLkkM";

const lecturerUrl =
  "https://dev-gateway.telkomuniversity.ac.id/0f5efc75bbfe9f82c255d0bca87c6d69/";

const fetLecturerRequest = () => {
  return {
    type: FETCH_LECTURER_REQUEST,
  };
};

const fetLecturerSuccess = (data) => {
  return {
    type: FETCH_LECTURER_SUCCESS,
    payload: {
      data: data,
    },
  };
};

const fetLecturerFailure = (error) => {
  return {
    type: FETCH_LECTURER_FAILURE,
    payload: error,
  };
};

export const fetchLecturerList = () => {
  return async (dispatch) => {
    try {
      dispatch(fetLecturerRequest());
      const res = await axios.get(lecturerUrl, {
        headers: {
          Authorization: `Bearer ${tokenSSO} `,
        },
      });
      dispatch(fetLecturerSuccess(res.data.data));
    } catch (e) {
      dispatch(fetLecturerFailure(e));
    }
  };
};
