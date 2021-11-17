import { authConstants } from '../constants';

const USER_KEY = process.env.REACT_APP_LOCAL_STORAGE_KEY_FOR_USER;

function storeUserInLocalStorage(user) {
  // store user details and jwt token in local storage to keep user logged in between page refreshes
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// inject the user on initial load from the storage
let user = JSON.parse(localStorage.getItem(USER_KEY));
const initialState = { initialLoadHappened: false, loading: false, loggedIn: user ? true : false, user: user ? user : null };


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
        user: action.user,
        errors: null
      }};
    case authConstants.LOGIN_REQUEST_FAILED:
      return {...state, ...{
        initialLoadHappened: true,
        loading: false,
        loggedIn: false,
        errors: action.error,
      }};
    case authConstants.LOGOUT_SUCCEEDED:
      localStorage.removeItem(process.env.REACT_APP_LOCAL_STORAGE_KEY_FOR_USER);
      return {...state, ...{
        initialLoadHappened: true,
        loading: false,
        loggedIn: false,
        user: null
      }};
    default:
      return state
  }
}