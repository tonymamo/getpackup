import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import { Link } from 'gatsby';

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
import {
  breakpoints,
  baseSpacer,
  quarterSpacer,
  borderRadius,
  quadrupleSpacer,
  octupleSpacer,
  baseAndAHalfSpacer,
} from '@styles/size';
import { brandTertiary, brandTertiaryHover, offWhite, white } from '@styles/color';
import { baseBorderStyle, z1Shadow } from '@styles/mixins';
import { FaBullhorn } from 'react-icons/fa';

export const AppContainer = styled.div`
  padding: ${baseSpacer} 0;
  margin-right: auto;
  margin-left: auto;
  max-width: ${breakpoints.xl};
  background-color: ${offWhite};
  border: ${baseBorderStyle};
  min-height: 100vh;
`;

const FeedbackLink = styled(Link)`
  position: fixed;
  z-index: 1;
  right: -${quadrupleSpacer};
  height: ${quadrupleSpacer};
  margin-top: -${baseAndAHalfSpacer}; /* half of above */
  top: 50%;
  width: ${octupleSpacer};
  background: ${brandTertiary};
  color: ${white};
  padding: ${quarterSpacer};
  box-shadow: ${z1Shadow};
  border-radius: ${borderRadius} ${borderRadius} 0 0;
  transform: rotate(-90deg);
  text-align: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${white};
    background-color: ${brandTertiaryHover};
    right: calc(-${quadrupleSpacer} + ${quarterSpacer});
  }
`;

const App = (props) => {
  const firebase = useFirebase();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const loggedInUser = useSelector((state: RootState) => state.firestore.ordered.loggedInUser);
  const activeLoggedInUser = loggedInUser && loggedInUser.length > 0 ? loggedInUser[0] : undefined;

  useEffect(() => {
    if (isLoaded(auth) && auth.uid) {
      if (
        ((activeLoggedInUser !== undefined && !activeLoggedInUser.username) ||
          activeLoggedInUser === undefined) &&
        isLoaded(profile)
      ) {
        firebase
          .firestore()
          .collection('users')
          .doc(auth.uid)
          .set({
            uid: auth.uid,
            email: auth.email,
            displayName: auth.displayName,
            photoURL: auth.photoURL,
            username: `${auth.displayName?.toLowerCase().replace(/[^0-9a-z]/gi, '')}${Math.floor(
              100000 + Math.random() * 900000
            )}`,
            bio: '',
            website: '',
            location: '',
          });
      }
    }
  }, [auth, loggedInUser]);

  if (!auth.isLoaded || !loggedInUser || activeLoggedInUser === undefined) {
    return <LoadingPage />;
  }

  return (
    <AppContainer>
      <ErrorBoundary>
        <Router basepath="/app" primary={false}>
          <PrivateRoute path="/profile" component={Profile} loggedInUser={activeLoggedInUser} />
          <PrivateRoute path="/trips" component={Trips} loggedInUser={activeLoggedInUser} />
          <PrivateRoute
            path="/trips/new"
            component={NewTripSummary}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute path="/trips/:id" component={TripById} loggedInUser={activeLoggedInUser} />
          <PrivateRoute
            path="/trips/:id/edit"
            component={EditTripSummary}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute
            path="/trips/:id/generator"
            component={TripGenerator}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute path="/search" component={Search} loggedInUser={activeLoggedInUser} />
          <PrivateRoute
            path="/shopping-list"
            component={ShoppingList}
            loggedInUser={activeLoggedInUser}
          />
        </Router>
      </ErrorBoundary>
      <FeedbackLink to="/feedback" state={{ pathname: props.location.pathname }}>
        <FaBullhorn /> Feedback
      </FeedbackLink>
    </AppContainer>
  );
};
export default App;
