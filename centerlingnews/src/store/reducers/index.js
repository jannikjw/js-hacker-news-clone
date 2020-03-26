import { combineReducers } from 'redux';

import { register } from './register.reducer';
import { verify } from './verify.reducer';
import { requestNewVerificationCode } from './requestNewVerificationCode.reducer';
import { login } from './login.reducer';
import { updatepassword } from './updatepassword.reducer';
import { forgot } from './forgot.reducer';

const rootReducer = combineReducers({
  register,
  verify,
  requestNewVerificationCode,
  login,
  updatepassword,
  forgot
});

export default rootReducer;