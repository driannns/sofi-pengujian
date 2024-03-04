import {
  FETCH_LECTURER_FAILURE,
  FETCH_LECTURER_REQUEST,
  FETCH_LECTURER_SUCCESS,
} from "./action";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

export const lecturerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LECTURER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_LECTURER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.data,
        error: null,
      };
    case FETCH_LECTURER_FAILURE:
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
