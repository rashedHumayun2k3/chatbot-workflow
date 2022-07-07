import { some } from 'lodash';
import {
  LOADING_ACTION,
  FAILURE_ACTION,
  GET_REQUEST_LIST_SUCCESS,
  ADD_REQUEST_SUCCESS,
  EDIT_AN_REQUEST_SUCCESS,
  ADD_NEW_FILE_INFO_REDUCER,
  STORE_FILE_INFO_REDUCER,
  STORE_STATUS_CODE,
  STORE_EDIT_STATUS_CODE,
  APROVED_STATUS_CODE,
  REJECTED_STATUS_CODE,
  APROVED_REJECT_STATUS_CODE,
  GET_REQUEST_DETAILS_SUCCESS,
  STORE_EDIT_FLAG_VALUE,
  REMOVE_A_FILE_FROM_REDUCER,
  REMOVE_A_BLOB_FILE_FROM_REDUCER,
  SET_SELECTED_REQUEST_TITLE,
  ADD_NEW_APPROVER_READER_TEMP,
  REMOVE_APPROVER_READER_TEMP,
  CLEAR_APPROVER_READER_TEMP,
  TEMPLATE_LIST_FROM_DB,
  SELECTED_TEMPLATE_FROM_USER,
} from '../action-types/request-types';

const initialState = {
  requestList: [],
  fileListArray: [],
  requestDetails: null,
  isLoading: false,
  errorMessage: null,
  requestInsertStatusCode: null,
  approvedStatusCode: null,
  successMsg: null,
  editFlagValue: null,
  requestEditStatusCode: null,
  removedBlobfileListArray: [],
  selectedRequestTitle: null,
  rejectedStatusCode: null,
  approvedRejectStatusCode: null,
  selectApproverReaderTemp: [],
  templateList: [],
  selectedTemplateFromUser: null,
};
const requestListReducer = (state = initialState, action) => {
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

    case GET_REQUEST_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        requestDetails: payload.requestDetails,
      };

    case GET_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        requestList: payload.requestList,
      };

    case ADD_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        requestList: [...state.requestList, payload.requestList],
      };

    case EDIT_AN_REQUEST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        requestList: state.requestList.map((item) => (Number(item.id) === Number(payload.requestList.id)
          ? payload.requestList
          : item)),
      };

    case ADD_NEW_FILE_INFO_REDUCER:
      return {
        ...state,
        isLoading: false,
        fileListArray: [payload.fileListArray, ...state.fileListArray],
      };

    case REMOVE_A_FILE_FROM_REDUCER:
      return {
        ...state,
        isLoading: false,
        successMsg: payload.successMsg,
        fileListArray: state.fileListArray.filter(
          (item) => item.uniqueId !== payload.fileData.uniqueId,
        ),
      };

    case REMOVE_A_BLOB_FILE_FROM_REDUCER:
      return {
        ...state,
        isLoading: false,
        removedBlobfileListArray: [
          ...state.removedBlobfileListArray,
          payload.fileData,
        ],
      };

    case STORE_FILE_INFO_REDUCER:
      return {
        ...state,
        isLoading: false,
        fileListArray: payload.fileListArray,
      };

    case STORE_STATUS_CODE:
      return {
        ...state,
        isLoading: false,
        requestInsertStatusCode: payload.requestInsertStatusCode,
      };

    case APROVED_STATUS_CODE:
      return {
        ...state,
        isLoading: false,
        approvedStatusCode: payload.approvedStatusCode,
      };

    case REJECTED_STATUS_CODE:
      return {
        ...state,
        isLoading: false,
        rejectedStatusCode: payload.rejectedStatusCode,
      };

    case APROVED_REJECT_STATUS_CODE:
      return {
        ...state,
        isLoading: false,
        approvedRejectStatusCode: payload.approvedRejectStatusCode,
      };

    case SET_SELECTED_REQUEST_TITLE:
      return {
        ...state,
        isLoading: false,
        selectedRequestTitle:
          payload.selectedRequestTitle
          && payload.selectedRequestTitle.length > 28
            ? `${payload.selectedRequestTitle.substring(0, 25)}...`
            : payload.selectedRequestTitle,
      };

    case STORE_EDIT_FLAG_VALUE:
      return {
        ...state,
        editFlagValue: payload.editFlagValue,
      };
    case STORE_EDIT_STATUS_CODE:
      return {
        ...state,
        isLoading: false,
        requestEditStatusCode: payload.requestEditStatusCode,
      };

    case ADD_NEW_APPROVER_READER_TEMP:
      return {
        ...state,
        selectApproverReaderTemp: !state.selectApproverReaderTemp.some((stateObj) => stateObj.LevelNo === payload.selectApproverReader.LevelNo)
          ? [...state.selectApproverReaderTemp, payload.selectApproverReader] : state.selectApproverReaderTemp,
      };

    case REMOVE_APPROVER_READER_TEMP:
      return {
        ...state,
        selectApproverReaderTemp: state.selectApproverReaderTemp.filter(
          (item) => item.LevelNo !== payload.LevelNo,
        ),
      };

    case CLEAR_APPROVER_READER_TEMP:
      return {
        ...state,
        selectApproverReaderTemp: [],
      };

    case TEMPLATE_LIST_FROM_DB:
      return {
        ...state,
        isLoading: false,
        templateList: payload.templateList,
      };

    case SELECTED_TEMPLATE_FROM_USER:
      return {
        ...state,
        selectedTemplateFromUser: payload.selectedTemplateFromUser,
      };

    default:
      return state;
  }
};

export default requestListReducer;
