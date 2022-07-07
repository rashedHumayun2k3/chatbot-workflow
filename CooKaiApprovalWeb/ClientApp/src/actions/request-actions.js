import caxios, { getAuthToken } from '../utils/axios';
import config from '../config';
import {
  LOADING_ACTION,
  FAILURE_ACTION,
  ADD_REQUEST_SUCCESS,
  EDIT_AN_REQUEST_SUCCESS,
  ADD_NEW_FILE_INFO_REDUCER,
  STORE_FILE_INFO_REDUCER,
  STORE_STATUS_CODE,
  GET_REQUEST_DETAILS_SUCCESS,
  STORE_EDIT_STATUS_CODE,
  REMOVE_A_FILE_FROM_REDUCER,
  REMOVE_A_BLOB_FILE_FROM_REDUCER,
  UPDATE_REQUEST_LIST_SUCCESS,
  SET_SELECTED_REQUEST_TITLE,
  ADD_NEW_APPROVER_READER_TEMP,
  REMOVE_APPROVER_READER_TEMP,
  CLEAR_APPROVER_READER_TEMP,
  TEMPLATE_LIST_FROM_DB,
  SELECTED_TEMPLATE_FROM_USER,
} from '../action-types/request-types';

import {
  ADD_NEW_REQUEST_SUCCESS,
} from '../action-types/dashboard-types';

export const loadingAction = (isLoading) => ({
  type: LOADING_ACTION,
  payload: {
    isLoading,
  },
});

export const failureAction = (error) => ({
  type: FAILURE_ACTION,
  payload: error,
});

export const setAddNewRequest = (response) => ({
  type: ADD_REQUEST_SUCCESS,
  payload: { requestList: response },
});

export const setEditAnRequest = (response) => ({
  type: EDIT_AN_REQUEST_SUCCESS,
  payload: { requestList: response },
});

export const addNewFileReducer = (fileListArray) => ({
  type: ADD_NEW_FILE_INFO_REDUCER,
  payload: { fileListArray },
});

export const removeAFileReducer = (fileData) => ({
  type: REMOVE_A_FILE_FROM_REDUCER,
  payload: { fileData },
});

export const removeABlobFileReducer = (fileData) => ({
  type: REMOVE_A_BLOB_FILE_FROM_REDUCER,
  payload: { fileData },
});

export const storeFileReducer = (fileListArray) => ({
  type: STORE_FILE_INFO_REDUCER,
  payload: { fileListArray },
});

export const changeInsertActionStatus = (requestInsertStatusCode) => ({
  type: STORE_STATUS_CODE,
  payload: { requestInsertStatusCode },
});

export const changeEditActionStatus = (requestEditStatusCode) => ({
  type: STORE_EDIT_STATUS_CODE,
  payload: { requestEditStatusCode },
});

export const addNewRequestSuccess = (requestItem) => ({
  type: ADD_NEW_REQUEST_SUCCESS,
  payload: { requestItem },
});

export const setGetRequestDetailsSuccess = (response) => ({
  type: GET_REQUEST_DETAILS_SUCCESS,
  payload: { requestDetails: response },

});

export const setRequestInsertActionStatus = async (dispatch, value) => {
  dispatch(changeInsertActionStatus(value));
};

export const setRequestEditActionStatus = async (dispatch, value) => {
  dispatch(changeEditActionStatus(value));
};

export const setUpdateRequestList = (response) => ({
  type: UPDATE_REQUEST_LIST_SUCCESS,
  payload: { requestDetails: response },
});

export const setSelectedRequestTitleReducer = (selectedRequestTitle) => ({
  type: SET_SELECTED_REQUEST_TITLE,
  payload: { selectedRequestTitle },
});

export const editAnRequest = async (dispatch, id, requestData) => {
  dispatch(loadingAction(true));
  await caxios
    .put(`/requests/${id}`, requestData)
    .then((res) => {
      dispatch(setEditAnRequest(res.data));
    })
    .catch((err) => {
      dispatch(failureAction(err.response));
    });
};

export const saveFileToDB = async (dispatch, fileData, tenantId, requestData, removedFiles, currentStatusId) => {
  dispatch(loadingAction(true));
  const token = await getAuthToken();
  // eslint-disable-next-line no-undef
  const formData = new FormData();
  const cloudFile = [];
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < fileData.length; index++) {
    if (fileData[index].webUrl) {
      const fileObject = {
        FileId: fileData[index].id,
        FileUrl: fileData[index].webUrl,
        FileSize: fileData[index].size,
        FileName: fileData[index].name,
      };
      cloudFile.push(fileObject);
    } else {
      formData.append(`file${{ index }}`, fileData[index]);
    }
  }
  formData.append('cloudFile', JSON.stringify(cloudFile));
  formData.append('tenantId', tenantId);
  formData.append('requestData', JSON.stringify(requestData));
  formData.append('removedFiles', JSON.stringify(removedFiles));
  // eslint-disable-next-line no-undef
  fetch(`${config.api.base}/ApprovalRequests/PostApprovalRequest`, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
    body: formData,
  },
  {
    redirect: 'follow',
  }).then((response) => response.json()).then((data) => {
    if (data && data.Message === 'An error has occurred.') {
      if (requestData.Id) {
        dispatch(changeEditActionStatus(500));
      } else {
        dispatch(changeInsertActionStatus(500));
      }
    } else if (data) {
      if (requestData.Id) {
        dispatch(changeEditActionStatus(200));
        dispatch(setGetRequestDetailsSuccess(data));
        dispatch(setUpdateRequestList(data));
      } else {
        dispatch(setSelectedRequestTitleReducer(data.Title));
        dispatch(changeInsertActionStatus(200));
        if (currentStatusId === 1 || currentStatusId === 2) {
          dispatch(addNewRequestSuccess(data));
        }
        dispatch(storeFileReducer([]));
      }
    }
  }).catch(() => {
    dispatch(changeInsertActionStatus(500));
  });
};

export const addNewFileData = async (dispatch, fileListArray) => {
  dispatch(addNewFileReducer(fileListArray));
};

export const removeFileData = async (dispatch, fileToRemove) => {
  dispatch(removeAFileReducer(fileToRemove));
};

export const removeBlobFileData = async (dispatch, fileToRemove) => {
  dispatch(removeABlobFileReducer(fileToRemove));
};

export const storeFileData = async (dispatch, fileListArray) => {
  dispatch(storeFileReducer(fileListArray));
};

export const getFileDetailsFromFileId = async (dispatch, fileId) => {
  dispatch(loadingAction(true));

  await caxios
    .get(`${config.api.graphBaseUrl}/me/drive/items/${fileId}`)
    .then((res) => {
      const {
        id, name, webUrl, size, file,
      } = res.data;
      const fileInfo = {
        uniqueId: id,
        id,
        name,
        webUrl,
        size,
        type: file.mimeType,

      };
      if (size < 10000000) {
        dispatch(addNewFileReducer(fileInfo));
      }
    })
    .catch((err) => {
      dispatch(failureAction(err.response));
    });
};

export const storeAddApproverTempIntoReducer = (selectApproverReader) => ({
  type: ADD_NEW_APPROVER_READER_TEMP,
  payload: { selectApproverReader },
});

export const storeRemoveApproverTempFromReducer = (LevelNo) => ({
  type: REMOVE_APPROVER_READER_TEMP,
  payload: { LevelNo },
});

export const clearApproverReaderTempFromReducer = () => ({
  type: CLEAR_APPROVER_READER_TEMP,
});

export const storeAddApproverTemp = async (dispatch, selectApproverReader) => {
  dispatch(storeAddApproverTempIntoReducer(selectApproverReader));
};

export const storeRemoveApproverTemp = async (dispatch, LevelNo) => {
  dispatch(storeRemoveApproverTempFromReducer(LevelNo));
};

export const clearApproverReaderTemp = async (dispatch) => {
  dispatch(clearApproverReaderTempFromReducer());
};

export const storeTemplateIntoReducer = (templateList) => ({
  type: TEMPLATE_LIST_FROM_DB,
  payload: { templateList },
});

export const getTemplateListFromDB = async (dispatch) => {
  dispatch(loadingAction(true));
  await caxios
    .get(`/Templates/GetTemplatesByCondition?isActive=${true}`)
    .then((res) => {
      dispatch(storeTemplateIntoReducer(res.data));
    })
    .catch((err) => {
      dispatch(failureAction(err));
    });
};

export const setSingleSelectedTemplateIntoRedux = (selectedTemplateFromUser) => ({
  type: SELECTED_TEMPLATE_FROM_USER,
  payload: { selectedTemplateFromUser },
});
export const saveSelectedTemplateIntoRedux = async (dispatch, selectedTemplateFromUser) => {
  dispatch(setSingleSelectedTemplateIntoRedux(selectedTemplateFromUser));
};

export const saveAttachmentAndRemarks = async (dispatch, fileData, tenantId, requestData, removedFiles) => {
  dispatch(loadingAction(true));
  const token = await getAuthToken();
  // eslint-disable-next-line no-undef
  const formData = new FormData();
  const cloudFile = [];
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < fileData.length; index++) {
    if (fileData[index].webUrl) {
      const fileObject = {
        FileId: fileData[index].id,
        FileUrl: fileData[index].webUrl,
        FileSize: fileData[index].size,
        FileName: fileData[index].name,
      };
      cloudFile.push(fileObject);
    } else {
      formData.append(`file${{ index }}`, fileData[index]);
    }
  }
  formData.append('cloudFile', JSON.stringify(cloudFile));
  formData.append('tenantId', tenantId);
  formData.append('requestData', JSON.stringify(requestData));
  formData.append('removedFiles', JSON.stringify(removedFiles));
  // eslint-disable-next-line no-undef
  fetch(`${config.api.base}/ApprovalRequests/PostRemarkAndFiles`, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
    body: formData,
  },
  {
    redirect: 'follow',
  }).then((response) => response.json()).then((data) => {
    if (data && data.Message === 'An error has occurred.') {
      if (requestData.Id) {
        dispatch(changeEditActionStatus(500));
      } else {
        dispatch(changeInsertActionStatus(500));
      }
    } else {
      dispatch(changeEditActionStatus(200));
      dispatch(setGetRequestDetailsSuccess(data));
      dispatch(setUpdateRequestList(data));
    }
  }).catch(() => {
    dispatch(changeEditActionStatus(500));
    dispatch(changeInsertActionStatus(500));
  });
};
