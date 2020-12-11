import { combineReducers } from 'redux';
import { firebaseReducer, FirebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import client from './client';
import { ClientStoreType } from './client.d';
import globalAlerts from './globalAlerts';
import { GlobalAlertsStoreType } from './globalAlerts.d';

export type RootState = {
  firebase: FirebaseReducer.Reducer<any, any>;
  firestore: any;
  client: ClientStoreType;
  globalAlerts: GlobalAlertsStoreType;
};

const rootReducer = combineReducers<RootState>({
  client,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  globalAlerts,
});

export default rootReducer;
