import { combineReducers } from 'redux';
import { firebaseReducer, FirebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import client from './client';
import { ClientStoreType } from './client.d';
import globalAlerts from './globalAlerts';
import { GlobalAlertsStoreType } from './globalAlerts.d';

// Optional: If you use the user profile option
interface Profile {
  name: string;
  email: string;
}

interface Trip {
  title: string;
  id: string;
  tripId: string;
  owner: string;
}

// Optional: You can define the schema of your Firebase Redux store.
// This will give you type-checking for state.firebase.data.todos and state.firebase.ordered.todos
interface Schema {
  trips: Trip;
}

export type RootState = {
  firebase: FirebaseReducer.Reducer<Profile, Schema>;
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
