import {
  FETCH_SIDANG_FAILURE,
  FETCH_SIDANG_REQUEST,
  FETCH_SIDANG_SUCCESS,
} from "./action";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

export const sidangReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SIDANG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_SIDANG_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    case FETCH_SIDANG_FAILURE:
      return {
        ...state,
        loading: false,
        data: [],
        error: action.payload.message,
      };
    default:
      return state;
  }
};
