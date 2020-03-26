import { authConstants } from '../constants';

const USER_KEY = process.env.REACT_APP_LOCAL_STORAGE_KEY_FOR_USER;

function storeUserInLocalStorage(user) {
  // store user details and jwt token in local storage to keep user logged in between page refreshes
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// inject the user on initial load from the storage
let user = JSON.parse(localStorage.getItem(USER_KEY));
const initialState = user ? { initialLoadHappened: false, loading: true, loggedIn: true, user: user } : {};


export function login(state = initialState, action) {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST_INITIATED:
      return {...state, ...{
        loading: true
      }};
    case authConstants.LOGIN_REQUEST_SUCCEEDED:
      storeUserInLocalStorage({...state.user, ...action.user});
      return {...state, ...{
        initialLoadHappened: true,
        loading: false,
        loggedIn: true,
        user: action.user
      }};
    case authConstants.LOGIN_REQUEST_FAILED:
      return {...state, ...{
        initialLoadHappened: true,
        loading: false,
        loggedIn: false,
        errors: action.error,
      }};
    default:
      return state
  }
}