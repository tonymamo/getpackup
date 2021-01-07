import React from 'react';
import { Router } from '@reach/router';
import { useSelector } from 'react-redux';
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
  const auth = useSelector((state: RootState) => state.firebase.auth);
  let loggedInUser = useSelector((state: RootState) => state.firestore.ordered.loggedInUser);
  loggedInUser = loggedInUser ? loggedInUser[0] : undefined;

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
