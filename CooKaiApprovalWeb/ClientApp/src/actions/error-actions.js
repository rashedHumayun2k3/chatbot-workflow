import { SET_ERROR, HIDE_ERROR } from '../action-types/error-types';

export function setError(error) {
  return {
    type: SET_ERROR,
    error,
  };
}

export function hideError() {
  return {
    type: HIDE_ERROR,
  };
}
