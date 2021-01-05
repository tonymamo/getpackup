import React from 'react';
import { Router } from '@reach/router';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
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
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const loggedInUser = useSelector((state: RootState) => state.firestore.ordered.loggedInUser);

  useFirestoreConnect([
    { collection: 'users', where: ['uid', '==', auth.uid], storeAs: 'loggedInUser' },
  ]);

  if (!auth.isLoaded || !loggedInUser || loggedInUser.length === 0) {
    return <LoadingPage />;
  }

  return (
    <AppContainer>
      <ErrorBoundary>
        <Router basepath="/app" primary={false}>
          <PrivateRoute path="/profile" component={Profile} loggedInUser={loggedInUser[0]} />
          <PrivateRoute path="/trips" component={Trips} loggedInUser={loggedInUser[0]} />
          <PrivateRoute
            path="/trips/new"
            component={NewTripSummary}
            loggedInUser={loggedInUser[0]}
          />
          <PrivateRoute path="/trips/:id" component={TripById} loggedInUser={loggedInUser[0]} />
          <PrivateRoute
            path="/trips/:id/edit"
            component={EditTripSummary}
            loggedInUser={loggedInUser[0]}
          />
          <PrivateRoute
            path="/trips/:id/generator"
            component={TripGenerator}
            loggedInUser={loggedInUser[0]}
          />
          <PrivateRoute path="/search" component={Search} loggedInUser={loggedInUser[0]} />
          <PrivateRoute
            path="/shopping-list"
            component={ShoppingList}
            loggedInUser={loggedInUser[0]}
          />
        </Router>
      </ErrorBoundary>
    </AppContainer>
  );
};
export default App;
