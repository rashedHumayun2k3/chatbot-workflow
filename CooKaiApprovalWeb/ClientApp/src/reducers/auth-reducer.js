import {
  LOADING_ACTION,
  FAILURE_ACTION,
  GET_ACCESS_TOKEN_BY_CODE_SUCCESS,
  GET_ACCESS_TOKEN_SUCCESS,
  GET_USER_FROM_GRAPH_SUCCESS,
  GET_GRAPH_FROM_GRAPH_SUCCESS,
  UPDATE_USER_PHOTO_FROM_GRAPH,
  GET_USER_ONE_BY_ONE_FROM_GRAPH,
  SET_LOGGED_IN_USER_DETAILS,
} from '../action-types/auth-request_types';

const initialState = {
  auth: {},
  userInformation: {},
  groupInformation: {},
  isLoading: false,
  errorMessage: null,
  stateLoggedInUser: null,
};
const authReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOADING_ACTION:
      return {
        ...state,
        isLoading: payload,
        errorMessage: null,
      };

    case FAILURE_ACTION:
      return {
        ...state,
        isLoading: false,
        errorMessage: payload,
      };

    case GET_ACCESS_TOKEN_BY_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        auth: payload.auth,
      };

    case GET_ACCESS_TOKEN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        auth: payload.auth,
      };

    case GET_USER_FROM_GRAPH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInformation: payload.userInformation,
      };

    case UPDATE_USER_PHOTO_FROM_GRAPH:
      return {
        ...state,
        isLoading: false,
        userInformation: state.userInformation && state.userInformation.length > 0
          ? state.userInformation.map((item) => (item.spid === payload.userInfo.spid ? payload.userInfo : item))
          : state.userInformation,
      };

    // case GET_USER_ONE_BY_ONE_FROM_GRAPH:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     userInformation: [...state.userInformation, payload.userInfo],
    //   };

    case GET_GRAPH_FROM_GRAPH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        groupInformation: payload.groupInformation,
      };

    case SET_LOGGED_IN_USER_DETAILS:
      return {
        ...state,
        isLoading: false,
        stateLoggedInUser: payload.loggedInUser,
      };

    default:
      return state;
  }
};

export default authReducer;
