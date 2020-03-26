import { authConstants } from '../constants';

const initialState = { registering: false, errors: {}, user: null };

export function register(state = initialState, action) {
  switch (action.type) {
    case authConstants.REGISTER_REQUEST_INITIATED:
      return {...state, ...{
        registering: true
      }};
    case authConstants.REGISTER_REQUEST_SUCCEEDED:
      return {...state, ...{
        registering: false,
        user: action.user,
        errors: {}
      }};
    case authConstants.REGISTER_REQUEST_FAILED:
      return {...state, ...{
        registering: false,
        errors: action.error
      }};
    default:
      return state
  }
}
