import React, { FunctionComponent, useEffect } from 'react';
import { Router } from '@reach/router';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useFirebase, isLoaded } from 'react-redux-firebase';

import Profile from '@views/Profile';
import Trips from '@views/Trips';
import NewTripSummary from '@views/NewTripSummary';
import TripById from '@views/TripById';
import TripGenerator from '@views/TripGenerator';
import AddTripHeaderImage from '@views/AddTripHeaderImage';
import GearCloset from '@views/GearCloset';
import GearClosetAddItem from '@views/GearClosetAddItem';
import GearClosetEditItem from '@views/GearClosetEditItem';
import ShoppingList from '@views/ShoppingList';
import { RootState } from '@redux/ducks';
import { PrivateRoute, LoadingPage, ErrorBoundary, FeedbackModal } from '@components';
import { breakpoints, baseSpacer } from '@styles/size';
import { offWhite } from '@styles/color';
import { z1Shadow } from '@styles/mixins';
import { UserType } from '@common/user';
import trackEvent from '@utils/trackEvent';

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

  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const loggedInUser = useSelector((state: RootState) => state.firestore.ordered.loggedInUser);
  const activeLoggedInUser: UserType =
    loggedInUser && loggedInUser.length > 0 ? loggedInUser[0] : undefined;

  useEffect(() => {
    if (isLoaded(auth) && auth.uid) {
      if (typeof window !== 'undefined') {
        if (window.analytics) {
          window.analytics.identify(auth.email as string, {
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
            username: `${auth.displayName?.toLowerCase().replace(/[^0-9a-z]/gi, '')}${Math.floor(
              100000 + Math.random() * 900000
            )}`,
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
        <Router basepath="/app">
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
          {/* <PrivateRoute
            path="/trips/:id/item/*"
            component={TripById}
            loggedInUser={activeLoggedInUser}
          /> */}
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
