import * as _ from 'lodash';
import {
  CREATE_TEMPLATE,
  DELETE_TEMPLATE,
  FAILURE_ACTION,
  GET_TEMPLATE_LIST,
  LOADING_ACTION,
  SET_TEMPLATE_MODE,
  TEMPLATE_TOGGLE,
} from '../action-types/template-action-types';

const initialState = {
  isLoading: false,
  errorMessage: null,
  templates: [],
  isTemplateCreating: false,
};

const TemplateReducer = (state = initialState, action) => {
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

    case CREATE_TEMPLATE:
      return {
        ...state,
        errorMessage: null,
        templates: [...state.templates, ...payload.templates],
        isLoading: false,
      };

    case DELETE_TEMPLATE:
      return {
        ...state,
        errorMessage: null,
        isLoading: false,
        templates: _.filter(
          state.templates,
          (template) => !_.isEqual(template.Id, payload.templateId),
        ),
      };

    case TEMPLATE_TOGGLE:
      return {
        ...state,
        errorMessage: null,
        isLoading: false,
        templates: _.chain(state.templates)
          .map((template) => {
            const draftTemp = template;
            if (draftTemp.Id === payload.templateId) {
              draftTemp.IsActive = !template.IsActive;
            }
            return draftTemp;
          })
          .filter({ IsActive: payload.status })
          .orderBy('Created', 'desc')
          .value(),
      };

    case SET_TEMPLATE_MODE:
      return {
        ...state,
        isTemplateCreating: payload.isTemplateCreating,
      };

    case GET_TEMPLATE_LIST:
      return {
        ...state,
        templates: _.orderBy(payload.templates, 'Created', 'desc').map(
          (template) => {
            const draftTemplate = template;
            draftTemplate.StepCount = template.StepList.length;
            return draftTemplate;
          },
        ),
        errorMessage: null,
        isLoading: false,
      };

    default:
      return {
        ...state,
      };
  }
};

export default TemplateReducer;
