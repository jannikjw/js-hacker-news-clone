import { combineReducers } from 'redux';

import { register } from './register.reducer';
import { verify } from './verify.reducer';
import { requestNewVerificationCode } from './requestNewVerificationCode.reducer';
import { login } from './login.reducer';

const rootReducer = combineReducers({
  register,
  verify,
  requestNewVerificationCode,
  login
});

export default rootReducer;