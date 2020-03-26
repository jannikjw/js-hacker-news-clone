import { combineReducers } from 'redux';

import { register } from './register.reducer';

const rootReducer = combineReducers({
  register,
});

export default rootReducer;