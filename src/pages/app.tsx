import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import styled from 'styled-components';

import Profile from '@views/Profile';
import Trips from '@views/Trips';
import NewTripSummary from '@views/NewTripSummary';
import EditTripSummary from '@views/EditTripSummary';
import TripById from '@views/TripById';
import TripGenerator from '@views/TripGenerator';
import Search from '@views/Search';
import ShoppingList from '@views/ShoppingList';
import { RootState } from '@redux/ducks';
import { PrivateRoute, LoadingPage, ErrorBoundary } from '@components';
import { breakpoints, baseSpacer } from '@styles/size';
import { offWhite } from '@styles/color';
import { baseBorderStyle } from '@styles/mixins';

const AppContainer = styled.div`
  padding: ${baseSpacer} 0;
  margin-right: auto;
  margin-left: auto;
  max-width: ${breakpoints.xl};
  background-color: ${offWhite};
  border: ${baseBorderStyle};
  min-height: 100vh;
`;

const App = () => {
  const firebase = useFirebase();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);

  useEffect(() => {
    // update user profile in firestore so we can sync name/id/photo for pulling in that data later
    // on things like shared trips
    // TODO: only update if auth has new email, displayName, photoUrl etc
    // eventually, split out photourl and handle profile photos ourselves,
    // but have auth.photoUrl has backup if empty when using Avatar component maybe
    // if (!auth.isEmpty && profile.isLoaded) {
    //   firebase
    //     .firestore()
    //     .collection('users')
    //     .doc(auth.uid)
    //     .update({
    //       isAdmin: profile.isAdmin || false,
    //       email: auth.email,
    //       uid: auth.uid,
    //       displayName: auth.displayName,
    //       photoURL: auth.photoURL,
    //     });
    // }
  }, [auth]);

  if (!auth.isLoaded) {
    return <LoadingPage />;
  }

  return (
    <AppContainer>
      <ErrorBoundary>
        <Router basepath="/app" primary={false}>
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/trips" component={Trips} />
          <PrivateRoute path="/trips/new" component={NewTripSummary} />
          <PrivateRoute path="/trips/:id" component={TripById} />
          <PrivateRoute path="/trips/:id/edit" component={EditTripSummary} />
          <PrivateRoute path="/trips/:id/generator" component={TripGenerator} />
          <PrivateRoute path="/search" component={Search} />
          <PrivateRoute path="/shopping-list" component={ShoppingList} />
        </Router>
      </ErrorBoundary>
    </AppContainer>
  );
};
export default App;
