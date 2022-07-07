import caxios from '../utils/axios';
import {
  LOADING_ACTION,
  FAILURE_ACTION,
  APROVED_STATUS_CODE,
  REJECTED_STATUS_CODE,
  APROVED_REJECT_STATUS_CODE,
  GET_REQUEST_DETAILS_SUCCESS,
  UPDATE_REQUEST_LIST_SUCCESS,
  STORE_EDIT_FLAG_VALUE,
  UPDATE_REQUEST_LIST_AFTER_APPROVE_REJECT,
  SET_SELECTED_REQUEST_TITLE,
} from '../action-types/request-types';

export const loadingAction = (isLoading) => ({
  type: LOADING_ACTION,
  payload: {
    isLoading,
  },
});

export const setRequestWithCommentsSuccess = (statusCode) => ({
  type: APROVED_STATUS_CODE,
  payload: { approvedStatusCode: statusCode },
});

export const setRejectedRequestWithCommentsSuccess = (statusCode) => ({
  type: REJECTED_STATUS_CODE,
  payload: { rejectedStatusCode: statusCode },
});

export const setApprovedRejectRequestWithCommentsSuccess = (statusCode) => ({
  type: APROVED_REJECT_STATUS_CODE,
  payload: { approvedRejectStatusCode: statusCode },
});

export const setSelectedRequestTitleReducer = (selectedRequestTitle) => ({
  type: SET_SELECTED_REQUEST_TITLE,
  payload: { selectedRequestTitle },
});

export const failureAction = (error) => ({
  type: FAILURE_ACTION,
  payload: error,
});

export const setGetRequestDetailsSuccess = (response) => ({
  type: GET_REQUEST_DETAILS_SUCCESS,
  payload: { requestDetails: response },

});

export const setUpdateRequestList = (response) => ({
  type: UPDATE_REQUEST_LIST_SUCCESS,
  payload: { requestDetails: response },
});
export const setUpdateRequestListAfterAction = (response) => ({
  type: UPDATE_REQUEST_LIST_AFTER_APPROVE_REJECT,
  payload: { requestDetails: response },
});

export const setRequestWithComments = async (dispatch, requestWithComment) => {
  dispatch(loadingAction(true));
  await caxios
    .post('/ApprovalRequests/ApproveOrReject', requestWithComment)
    .then((res) => {
      if (requestWithComment.IsForApprove === true) {
        dispatch(setRequestWithCommentsSuccess(200));
      } else {
        dispatch(setRejectedRequestWithCommentsSuccess(200));
      }
      dispatch(setApprovedRejectRequestWithCommentsSuccess(200));
      dispatch(setGetRequestDetailsSuccess(res.data));
      dispatch(setUpdateRequestListAfterAction(res.data));
    })
    .catch((err) => {
      dispatch(failureAction(err));
      dispatch(setApprovedRejectRequestWithCommentsSuccess(500));
    });
};

export const getListRequestDetails = async (dispatch, requestID) => {
  dispatch(loadingAction(true));
  await caxios
    .get(`/ApprovalRequests/GetApprovalRequestById/${requestID}`)
    .then((res) => {
      if (res.data) {
        dispatch(setGetRequestDetailsSuccess(res.data));
        dispatch(setSelectedRequestTitleReducer(res.data.Title));
      }
    })
    .catch((err) => {
      dispatch(failureAction(err));
    });
};

export const storeEditFlagReducer = (editFlagValue) => ({
  type: STORE_EDIT_FLAG_VALUE,
  payload: { editFlagValue },
});

export const setEditFlag = async (dispatch, editFlagValue) => {
  dispatch(storeEditFlagReducer(editFlagValue));
};

export const setRequestDetailsNull = async (dispatch) => {
  dispatch(setGetRequestDetailsSuccess(null));
};

export const setApprovedRequestStatusNull = async (dispatch) => {
  dispatch(setRequestWithCommentsSuccess(null));
};

export const setRejectedRequestStatusNull = async (dispatch) => {
  dispatch(setRejectedRequestWithCommentsSuccess(null));
};

export const setApprovedRejectedRequestStatusNull = async (dispatch) => {
  dispatch(setApprovedRejectRequestWithCommentsSuccess(null));
};

export const setSelectedRequestTitleInReducer = async (dispatch, title) => {
  dispatch(setSelectedRequestTitleReducer(title));
};
