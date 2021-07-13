import { combineReducers } from 'redux';
import { firebaseReducer, FirebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import client from '@redux/ducks/client';
import { ClientStoreType } from '@redux/ducks/client.d';
import globalAlerts from '@redux/ducks/globalAlerts';
import { GlobalAlertsStoreType } from '@redux/ducks/globalAlerts.d';

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
