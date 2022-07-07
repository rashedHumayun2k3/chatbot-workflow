import {
  LOADING_ACTION,
  FAILURE_ACTION,
  GET_REQUEST_LIST_SUCCESS,
  GET_REQUEST_STATS_SUCCESS,
  GET_REQUEST_LATEST_STATUS,
  ADD_NEW_REQUEST_SUCCESS,
  DELETE_REQUEST_SUCCESS,
  RESET_REQUEST_LIST,
  STOP_REQUEST_LIST,
  LIST_LOADING_ACTION,
  GET_CURRENT_STATUS_ID,
} from '../action-types/dashboard-types';

import {
  UPDATE_REQUEST_LIST_SUCCESS, UPDATE_REQUEST_LIST_AFTER_APPROVE_REJECT,
} from '../action-types/request-types';

const initialState = {
  requestList: [],
  isLoading: false,
  errorMessage: null,
  requestStats: [],
  latestStatusId: null,
  successMsg: null,
  requestId: null,
  stopScrolling: false,
  isListLoading: false,
  currentStatusId: null,
};
const dashboardReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOADING_ACTION:
      return {
        ...state,
        isLoading: payload,
        stopScrolling: false,
        errorMessage: null,
      };
    case LIST_LOADING_ACTION:
      return {
        ...state,
        isListLoading: payload,
        stopScrolling: false,
        errorMessage: null,
      };

    case FAILURE_ACTION:
      return {
        ...state,
        isLoading: false,
        stopScrolling: false,
        errorMessage: payload,
      };
    case GET_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        stopScrolling: false,
        isListLoading: false,
        requestList: [...state.requestList, payload.requestList],
      };
    case RESET_REQUEST_LIST:
      return {
        ...state,
        isLoading: false,
        stopScrolling: false,
        isListLoading: false,
        requestList: payload.requestList,
      };
    case STOP_REQUEST_LIST:
      return {
        ...state,
        isLoading: false,
        isListLoading: false,
        stopScrolling: true,
      };
    case GET_REQUEST_STATS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        requestStats: payload.statsList,
      };
    case GET_REQUEST_LATEST_STATUS:
      return {
        ...state,
        isLoading: false,
        stopScrolling: false,
        isListLoading: false,
        latestStatusId: payload.latestStatusId,
      };
    case GET_CURRENT_STATUS_ID:
      return {
        ...state,
        isLoading: false,
        currentStatusId: payload.currentStatusId,
      };

    case UPDATE_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isListLoading: false,
        requestList: state.requestList.map((item) => (item.Id === payload.requestDetails.Id ? payload.requestDetails : item)),
      };
    case UPDATE_REQUEST_LIST_AFTER_APPROVE_REJECT:
      return {
        ...state,
        isLoading: false,
        isListLoading: false,
        requestList: state.requestList.filter((item) => item.Id !== payload.requestDetails.Id),
      };

    case ADD_NEW_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isListLoading: false,
        requestList: [payload.requestItem, ...state.requestList],
      };

    case DELETE_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        stopScrolling: false,
        successMsg: payload.successMsg,
        requestList: state.requestList.filter((item) => item.Id !== payload.requestId),
      };

    default:
      return state;
  }
};

export default dashboardReducer;
