import { authConstants } from '../constants';

const initialState = { requesting: false, errors: {}, message: null };

export function requestNewVerificationCode(state = initialState, action) {
  switch (action.type) {
    case authConstants.SEND_NEW_CODE_REQUEST_INITIATED:
      return {
        requesting: true,
        message: null
      };
    case authConstants.SEND_NEW_CODE_REQUEST_SUCCEEDED:
      return {
        requesting: false,
        message: action.message,
        errors: {}
      };
    case authConstants.SEND_NEW_CODE_REQUEST_FAILED:
      return {
        requesting: false,
        errors: action.error
      };
    default:
      return state
  }
}
