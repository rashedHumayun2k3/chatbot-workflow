import { HIDE_ERROR } from '../action-types/error-types';

const initState = {
  error: null,
  isOpen: false,
};
export function errorReducer(state = initState, action) {
  const { error } = action;

  if (error) {
    return {
      error,
      isOpen: true,
    };
  } if (action.type === HIDE_ERROR) {
    return {
      error: null,
      isOpen: false,
    };
  }

  return state;
}
