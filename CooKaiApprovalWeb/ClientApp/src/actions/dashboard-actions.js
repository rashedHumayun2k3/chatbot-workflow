import axios from 'axios';
import caxios from '../utils/axios';
import config from '../config';
import {
  LOADING_ACTION,
  FAILURE_ACTION,
  GET_REQUEST_LIST_SUCCESS,
  GET_REQUEST_STATS_SUCCESS,
  GET_REQUEST_LATEST_STATUS,
  DELETE_REQUEST_SUCCESS,
  RESET_REQUEST_LIST,
  STOP_REQUEST_LIST,
  LIST_LOADING_ACTION,
  GET_CURRENT_STATUS_ID,
} from '../action-types/dashboard-types';

export const loadingAction = (isLoading) => ({
  type: LOADING_ACTION,
  payload: {
    isLoading,
  },
});
export const listLoadingAction = (isListLoading) => ({
  type: LIST_LOADING_ACTION,
  payload: {
    isListLoading,
  },
});

export const failureAction = (error) => ({
  type: FAILURE_ACTION,
  payload: error,
});

export const setRequestStatisticsSuccess = (response) => ({
  type: GET_REQUEST_STATS_SUCCESS,
  payload: { statsList: response },
});
export const getStatsRequest = async (dispatch, email) => {
  dispatch(loadingAction(true));
  await caxios
    .get(`${config.api.base}/ApprovalRequests/GetDashboardStats?userPrincipal=${email}`)
    .then((res) => {
      dispatch(setRequestStatisticsSuccess(res.data));
    })
    .catch((err) => {
      dispatch(failureAction(err));
    });
};

export const setGetListRequestSuccess = (response) => ({
  type: GET_REQUEST_LIST_SUCCESS,
  payload: { requestList: response, isListLoading: false },

});
export const stopLoadingIcon = () => ({
  type: STOP_REQUEST_LIST,
  payload: { isLoading: false, isListLoading: false, stopScrolling: true },

});
export const resetRequestList = () => ({
  type: RESET_REQUEST_LIST,
  payload: { requestList: [] },

});

export const setDeleteRequestSuccess = (response, requestId) => ({
  type: DELETE_REQUEST_SUCCESS,
  payload: { successMsg: response, requestId },
});
export const setGetLatestDropdownStatus = (response) => ({
  type: GET_REQUEST_LATEST_STATUS,
  payload: { latestStatusId: response },

});

export const setCurrentStatusId = (response) => ({
  type: GET_CURRENT_STATUS_ID,
  payload: { currentStatusId: response },
});

export const getLatestDropdownStatus = async (dispatch, email) => {
  dispatch(loadingAction(true));
  await caxios
    .get(`${config.api.base}/ApprovalRequests/GetSeletedFilterStatus?useremail=${email}`)
    .then((res) => {
      dispatch(setGetLatestDropdownStatus(res.data));
      dispatch(setCurrentStatusId(res.data));
    })
    .catch((err) => {
      dispatch(failureAction(err));
    });
};
export const setDeleteRequestActionStatus = async (dispatch, response, value) => {
  dispatch(setDeleteRequestSuccess(response, value));
};
export const resetRequestListAction = async (dispatch) => {
  dispatch(resetRequestList());
};

export const getRequestList = async (dispatch, email, startDate, endDate, status, index) => {
  dispatch(listLoadingAction(true));
  await caxios
    .get(`${config.api.base}/ApprovalRequests/GetApprovalRequests?userPrincipal=${email}&startDate=${startDate}&endDate=${endDate}&selectedFilter=${status}&pageIndex=${index}`)
    .then((res) => {
      getStatsRequest(dispatch, email);
      if (res.data && res.data.length > 0) {
        res.data.forEach((element) => dispatch(setGetListRequestSuccess(element)));
      } else {
        dispatch(stopLoadingIcon());
      }
    })
    .catch((err) => {
      dispatch(failureAction(err));
    });
};
export const deleteSingleRequestById = async (dispatch, requestID) => {
  dispatch(loadingAction(true));
  await caxios
  // .delete(config.api.base + `/ApprovalRequests/DeleteApprovalRequestById/${requestID}`)
    .delete(`/ApprovalRequests/DeleteApprovalRequestById/${requestID}`)
    .then((response) => {
      dispatch(setDeleteRequestSuccess(response.data, requestID));
    })
    .catch((err) => {
      dispatch(failureAction(err.response));
    });
};

export const setCurrentStatusIdInReducer = async (dispatch, statusId) => {
  dispatch(setCurrentStatusId(statusId));
};
