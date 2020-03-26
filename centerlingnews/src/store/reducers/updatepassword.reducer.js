import { authConstants } from '../constants';

const initialState = { updating: false, errors: {}, message: null };

export function updatePassword(state = initialState, action) {
  switch (action.type) {
    case authConstants.UPDATE_PW_REQUEST_INITIATED:
      return {
        updating: true,
        message: null
      };
    case authConstants.UPDATE_PW_REQUEST_SUCCEEDED:
      return {
        updating: false,
        message: action.message
      };
    case authConstants.UPDATE_PW_REQUEST_FAILED:
      return {
        updating: false,
        errors: action.error
      };
    default:
      return state
  }
}