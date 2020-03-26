import { authConstants } from '../constants';

const initialState = { sending: false, errors: {}, message: null };

export function forgotPassword(state = initialState, action) {
  switch (action.type) {
    case authConstants.FORGOT_PW_REQUEST_INITIATED:
      return {
        sending: true,
        message: null,
        errors: state.errors
      };
    case authConstants.FORGOT_PW_REQUEST_SUCCEEDED:
      return {
        sending: false,
        message: action.message,
        errors: null
      };
    case authConstants.FORGOT_PW_REQUEST_FAILED:
      return {
        sending: false,
        errors: action.error,
        message: null
      };
    default:
      return state
  }
}