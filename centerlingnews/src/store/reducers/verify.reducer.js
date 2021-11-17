import { authConstants } from '../constants';

const initialState = { verifying: false, errors: {}, user: null };

export function verify(state = initialState, action) {
  switch (action.type) {
    case authConstants.VERIFY_REQUEST_INITIATED:
      return {...state,  ...{
        verifying: true
      }};
    case authConstants.VERIFY_REQUEST_SUCCEEDED:
      return {...state,  ...{
        verifying: false,
        user: action.user,
        errors: {}
      }};
    case authConstants.VERIFY_REQUEST_FAILED:
      return {
        verifying: false,
        errors: action.error
      };
    default:
      return state
  }
}