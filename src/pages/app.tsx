import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useFirebase, isLoaded } from 'react-redux-firebase';

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

export const AppContainer = styled.div`
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
  let loggedInUser = useSelector((state: RootState) => state.firestore.ordered.loggedInUser);
  loggedInUser = loggedInUser && loggedInUser.length > 0 ? loggedInUser[0] : undefined;

  useEffect(() => {
    // if (isLoaded(auth) && auth.uid && (!loggedInUser || !loggedInUser.username)) {
    if (isLoaded(auth) && auth.uid && isLoaded(loggedInUser) && !loggedInUser.username) {
      console.log('here');
      firebase
        .firestore()
        .collection('users')
        .doc(auth.uid)
        .set({
          uid: loggedInUser ? loggedInUser.uid : auth.uid,
          email: loggedInUser ? loggedInUser.email : auth.email,
          displayName: loggedInUser ? loggedInUser.displayName : auth.displayName,
          photoURL: loggedInUser ? loggedInUser.photoURL : auth.photoURL,
          username: loggedInUser.displayName
            ? `${loggedInUser.displayName?.toLowerCase().replace(/[^0-9a-z]/gi, '')}${Math.floor(
                100000 + Math.random() * 900000
              )}`
            : auth.uid,
          bio: loggedInUser ? loggedInUser.bio : '',
          website: loggedInUser ? loggedInUser.website : '',
          location: loggedInUser ? loggedInUser.location : '',
        });
    }
  }, [auth, loggedInUser]);

  if (!auth.isLoaded || !loggedInUser) {
    return <LoadingPage />;
  }

  return (
    <AppContainer>
      <ErrorBoundary>
        <Router basepath="/app" primary={false}>
          <PrivateRoute path="/profile" component={Profile} loggedInUser={loggedInUser} />
          <PrivateRoute path="/trips" component={Trips} loggedInUser={loggedInUser} />
          <PrivateRoute path="/trips/new" component={NewTripSummary} loggedInUser={loggedInUser} />
          <PrivateRoute path="/trips/:id" component={TripById} loggedInUser={loggedInUser} />
          <PrivateRoute
            path="/trips/:id/edit"
            component={EditTripSummary}
            loggedInUser={loggedInUser}
          />
          <PrivateRoute
            path="/trips/:id/generator"
            component={TripGenerator}
            loggedInUser={loggedInUser}
          />
          <PrivateRoute path="/search" component={Search} loggedInUser={loggedInUser} />
          <PrivateRoute
            path="/shopping-list"
            component={ShoppingList}
            loggedInUser={loggedInUser}
          />
        </Router>
      </ErrorBoundary>
    </AppContainer>
  );
};
export default App;
