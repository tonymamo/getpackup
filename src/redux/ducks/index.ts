import client from '@redux/ducks/client';
import { ClientStoreType } from '@redux/ducks/client.d';
import globalAlerts from '@redux/ducks/globalAlerts';
import { GlobalAlertsStoreType } from '@redux/ducks/globalAlerts.d';
import workerUpdateReady from '@redux/ducks/workerUpdateReady';
import { WorkerUpdateStoreType } from '@redux/ducks/workerUpdateReady.d';
import { FirebaseReducer, firebaseReducer } from 'react-redux-firebase';
import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';

export type RootState = {
  firebase: FirebaseReducer.Reducer<any, any>;
  firestore: any;
  client: ClientStoreType;
  globalAlerts: GlobalAlertsStoreType;
  workerUpdateReady: WorkerUpdateStoreType;
};

const rootReducer = combineReducers<RootState>({
  client,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  globalAlerts,
  workerUpdateReady,
});

export default rootReducer;
