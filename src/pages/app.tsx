import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';

import Profile from '../views/Profile';
import Trips from '../views/Trips';
import NewTripSummary from '../views/NewTripSummary';
import EditTripSummary from '../views/EditTripSummary';
import TripById from '../views/TripById';
import { RootState } from '../redux/ducks';
import { PrivateRoute, LoadingPage, ErrorBoundary } from '../components';

const App = () => {
  const firebase = useFirebase();
  const user = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);

  useEffect(() => {
    if (!user.isEmpty && profile.isEmpty) {
      firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          email: user.email,
        });
    }
  }, []);

  if (!user.isLoaded) {
    return <LoadingPage />;
  }

  return (
    <ErrorBoundary>
      <Router basepath="/app" primary={false}>
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/trips" component={Trips} />
        <PrivateRoute path="/trips/new" component={NewTripSummary} />
        <PrivateRoute path="/trips/:id" component={TripById} />
        <PrivateRoute path="/trips/:id/edit" component={EditTripSummary} />
      </Router>
    </ErrorBoundary>
  );
};
export default App;
