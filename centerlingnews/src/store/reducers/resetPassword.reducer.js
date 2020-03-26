import { authConstants } from '../constants';

const initialState = { resetting: false, errors: {}, message: null };

export function resetPassword(state = initialState, action) {
  switch (action.type) {
    case authConstants.RESET_PW_REQUEST_INITIATED:
      return {
        resetting: true,
        message: null
      };
    case authConstants.RESET_PW_REQUEST_SUCCEEDED:
      return {
        resetting: false,
        message: action.message
      };
    case authConstants.RESET_PW_REQUEST_FAILED:
      return {
        errors: action.error
      };
    default:
      return state
  }
}