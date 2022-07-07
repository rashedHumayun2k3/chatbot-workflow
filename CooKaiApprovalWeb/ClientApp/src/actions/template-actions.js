import {
  LOADING_ACTION,
  FAILURE_ACTION,
  CREATE_TEMPLATE,
  SET_TEMPLATE_MODE,
  GET_TEMPLATE_LIST,
  DELETE_TEMPLATE,
  TEMPLATE_TOGGLE,
} from '../action-types/template-action-types';
import caxios from '../utils/axios';

const loadingAction = (isLoading) => ({
  type: LOADING_ACTION,
  payload: {
    isLoading,
  },
});
const failureAction = (error) => ({
  type: FAILURE_ACTION,
  payload: error,
});

// create template
const setCreateTemplate = (response) => ({
  type: CREATE_TEMPLATE,
  payload: { templates: response },
});

export const createTemplate = async (dispatch, templateData) => {
  dispatch(loadingAction(true));
  await caxios
    .post('/Templates/CreateTemplate', templateData)
    .then((res) => {
      dispatch(setCreateTemplate(res.data));
    })
    .catch((err) => {
      dispatch(failureAction(err));
    });
};
const setTemplateModeInRedux = (response) => ({
  type: SET_TEMPLATE_MODE,
  payload: { isTemplateCreating: response },
});

export const setTemplateCreatingMode = async (dispatch, modeOnOff) => {
  dispatch(setTemplateModeInRedux(modeOnOff));
};

/**
 *
 * get template list
 */

const setGetTemplateList = (response) => ({
  type: GET_TEMPLATE_LIST,
  payload: { templates: response },
});

export const getTemplateList = async (dispatch, isActive) => {
  dispatch(loadingAction(true));

  await caxios
    .get(`/Templates/GetTemplatesByCondition?isActive=${isActive}`)
    .then((res) => {
      dispatch(setGetTemplateList(res.data));
    })
    .catch((err) => {
      dispatch(failureAction(err));
    });
};

/**
 * Delete Template
 */

const setDeleteTemplate = (response) => ({
  type: DELETE_TEMPLATE,
  payload: { templateId: response },
});

export const deleteTemplate = async (dispatch, id) => {
  dispatch(loadingAction(true));

  await caxios
    .delete(`/Templates/DeleteTemplateById/${id}`)
    .then(() => {
      dispatch(setDeleteTemplate(id));
    })
    .catch((err) => dispatch(failureAction(err)));
};

/**
 * Toggle Template
 */

const setTemplateVisibility = (response) => ({
  type: TEMPLATE_TOGGLE,
  payload: response,
});

export const templateVisibility = async (dispatch, id, status) => {
  dispatch(loadingAction(true));
  await caxios
    .patch(`/Templates/ToggleTemplateVisibility/${id}`)
    .then(() => {
      dispatch(setTemplateVisibility({ templateId: id, status }));
    })
    .catch((err) => dispatch(failureAction(err)));
};
