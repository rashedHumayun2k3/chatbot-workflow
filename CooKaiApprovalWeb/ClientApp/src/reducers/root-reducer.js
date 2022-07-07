import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';
import requestListReducer from './request-reducer';
import { errorReducer } from './error-reducer';
import auth from './auth-reducer';

import dashboardReducer from './dashboard-reducer';
import TemplateReducer from './template-reducer';

export default (history) => combineReducers({
  router: connectRouter(history),
  form: formReducer,
  error: errorReducer,
  request: requestListReducer,
  auth,
  dashboard: dashboardReducer,
  template: TemplateReducer,
});
