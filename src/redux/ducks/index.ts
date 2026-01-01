import client from '@redux/ducks/client';
import { ClientStoreType } from '@redux/ducks/client.d';
import globalAlerts from '@redux/ducks/globalAlerts';
import { GlobalAlertsStoreType } from '@redux/ducks/globalAlerts.d';
import { combineReducers } from 'redux';

export type RootState = {
  client: ClientStoreType;
  globalAlerts: GlobalAlertsStoreType;
};

const rootReducer = combineReducers<RootState>({
  client,
  globalAlerts,
});

export default rootReducer;
