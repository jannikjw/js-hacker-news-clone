import { combineReducers } from 'redux';

import { register } from './register.reducer';
import { verify } from './verify.reducer';
import { requestNewVerificationCode } from './requestNewVerificationCode.reducer';

const rootReducer = combineReducers({
  register,
  verify,
  requestNewVerificationCode
});

export default rootReducer;