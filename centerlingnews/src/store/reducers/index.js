import { combineReducers } from 'redux';

import { register } from './register.reducer';
import { verify } from './verify.reducer';
import { requestNewVerificationCode } from './requestNewVerificationCode.reducer';
import { login } from './login.reducer';
import { updatePassword } from './updatepassword.reducer';
import { forgotPassword } from './forgotPassword.reducer';
import { resetPassword } from './resetPassword.reducer';

const rootReducer = combineReducers({
  register,
  verify,
  requestNewVerificationCode,
  login,
  updatePassword,
  forgotPassword,
  resetPassword,
});

export default rootReducer;