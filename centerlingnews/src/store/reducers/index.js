import { combineReducers } from 'redux';

import { register } from './register.reducer';
import { verify } from './verify.reducer';

const rootReducer = combineReducers({
  register,
  verify
});

export default rootReducer;