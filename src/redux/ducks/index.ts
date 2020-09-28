import { combineReducers } from 'redux';

import globalAlerts from './globalAlerts';

const rootReducer = combineReducers({
  globalAlerts,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
