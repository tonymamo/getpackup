import React, { FunctionComponent, useEffect } from 'react';
import { navigate, Router, useLocation } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useFirebase, isLoaded } from 'react-redux-firebase';
import * as Sentry from '@sentry/gatsby';

import Profile from '@views/Profile';
import Trips from '@views/Trips';
import NewTripSummary from '@views/NewTripSummary';
import TripById from '@views/TripById';
import TripGenerator from '@views/TripGenerator';
import AddTripHeaderImage from '@views/AddTripHeaderImage';
import GearCloset from '@views/GearCloset';
import GearClosetSetup from '@views/GearClosetSetup';
import GearClosetAddItem from '@views/GearClosetAddItem';
import GearClosetEditItem from '@views/GearClosetEditItem';
import ShoppingList from '@views/ShoppingList';
import Onboarding from '@views/Onboarding';
import { RootState } from '@redux/ducks';
import { PrivateRoute, LoadingPage, ErrorBoundary, FeedbackModal } from '@components';
import { breakpoints, baseSpacer } from '@styles/size';
import { offWhite } from '@styles/color';
import { z1Shadow } from '@styles/mixins';
import { UserType } from '@common/user';
import trackEvent from '@utils/trackEvent';
import { addAlert } from '@redux/ducks/globalAlerts';
import { addAttemptedPrivatePage } from '@redux/ducks/client';

export const AppContainer = styled.div`
  padding: ${baseSpacer} 0;
  margin-right: auto;
  margin-left: auto;
  max-width: ${breakpoints.xl};
  background-color: ${offWhite};
  min-height: 100vh;
  box-shadow: ${z1Shadow};
`;

const App: FunctionComponent<{}> = (props) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const location = useLocation();

  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const loggedInUser = useSelector((state: RootState) => state.firestore.ordered.loggedInUser);
  const activeLoggedInUser: UserType =
    loggedInUser && loggedInUser.length > 0 ? loggedInUser[0] : undefined;

  useEffect(() => {
    if (auth.isLoaded && auth.isEmpty) {
      if (location) {
        trackEvent('Attempted Private Page', { location });
        dispatch(addAttemptedPrivatePage(location.pathname));
      }
      navigate('/login');
      dispatch(
        addAlert({
          type: 'danger',
          message: 'Please log in to access that page',
        })
      );
    }
  }, [auth]);

  useEffect(() => {
    if (isLoaded(auth) && auth.uid) {
      if (typeof window !== 'undefined') {
        if (window.analytics && auth.email) {
          window.analytics.identify(auth.email, {
            userId: auth.uid,
            email: auth.email,
            displayName: auth.displayName || '',
          });
          Sentry.setUser({
            userId: auth.uid,
            email: auth.email,
            displayName: auth.displayName || '',
          });
        }
      }
      if (
        ((activeLoggedInUser !== undefined && !activeLoggedInUser.username) ||
          activeLoggedInUser === undefined) &&
        isLoaded(profile)
      ) {
        const displayNameDefault =
          auth.displayName?.toLowerCase().replace(/[^0-9a-z]/gi, '') || 'user';
        firebase
          .firestore()
          .collection('users')
          .doc(auth.uid)
          .set({
            uid: auth.uid,
            email: auth.email,
            emailVerified: auth.emailVerified,
            displayName: auth.displayName,
            photoURL: auth.photoURL,
            username: `${displayNameDefault}${Math.floor(100000 + Math.random() * 900000)}`,
            bio: '',
            website: '',
            location: '',
            lastUpdated: new Date(),
          })
          .then(() => {
            trackEvent('User Profile Initial Info Set', {
              uid: auth.uid,
              email: auth.email,
              emailVerified: auth.emailVerified,
              displayName: auth.displayName,
              photoURL: auth.photoURL,
              username: `${auth.displayName?.toLowerCase().replace(/[^0-9a-z]/gi, '')}${Math.floor(
                100000 + Math.random() * 900000
              )}`,
            });
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
          <PrivateRoute
            path="/onboarding"
            component={Onboarding}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute path="/profile" component={Profile} loggedInUser={activeLoggedInUser} />
          <PrivateRoute path="/trips" component={Trips} loggedInUser={activeLoggedInUser} />
          <PrivateRoute
            path="/trips/new"
            component={NewTripSummary}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute
            path="/trips/:id/add-trip-image"
            component={AddTripHeaderImage}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute
            path="/trips/:id/generator"
            component={TripGenerator}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute
            path="/trips/:id/*"
            component={TripById}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute
            path="/gear-closet/setup"
            component={GearClosetSetup}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute
            path="/gear-closet"
            component={GearCloset}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute
            path="/gear-closet/new"
            component={GearClosetAddItem}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute
            path="/gear-closet/:id"
            component={GearClosetEditItem}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute
            path="/shopping-list"
            component={ShoppingList}
            loggedInUser={activeLoggedInUser}
          />
        </Router>
      </ErrorBoundary>
      <FeedbackModal auth={auth} {...props} />
    </AppContainer>
  );
};
export default App;
