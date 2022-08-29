import { UserType } from '@common/user';
import {
  Button,
  ErrorBoundary,
  FeedbackModal,
  Heading,
  LoadingPage,
  Modal,
  PrivateRoute,
} from '@components';
import UpdateConfirmModal from '@components/UpdateConfirmModal';
import loadable from '@loadable/component';
import { Router, navigate, useLocation } from '@reach/router';
import { RootState } from '@redux/ducks';
import { addAttemptedPrivatePage } from '@redux/ducks/client';
import * as Sentry from '@sentry/gatsby';
import { offWhite } from '@styles/color';
import { z1Shadow } from '@styles/mixins';
import { baseSpacer, breakpoints } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import usePrevious from '@utils/usePrevious';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isLoaded, useFirebase } from 'react-redux-firebase';
import styled from 'styled-components';

const Profile = loadable(() => import('@views/Profile'), { fallback: <LoadingPage /> });
const Trips = loadable(() => import('@views/Trips'), { fallback: <LoadingPage /> });
const NewTripSummary = loadable(() => import('@views/NewTripSummary'), {
  fallback: <LoadingPage />,
});
const TripById = loadable(() => import('@views/TripById'), { fallback: <LoadingPage /> });
const TripGenerator = loadable(() => import('@views/TripGenerator'), { fallback: <LoadingPage /> });
const AddTripHeaderImage = loadable(() => import('@views/AddTripHeaderImage'), {
  fallback: <LoadingPage />,
});
const GearCloset = loadable(() => import('@views/GearCloset'), { fallback: <LoadingPage /> });
const GearClosetAddItem = loadable(() => import('@views/GearClosetAddItem'), {
  fallback: <LoadingPage />,
});
const GearClosetEditItem = loadable(() => import('@views/GearClosetEditItem'), {
  fallback: <LoadingPage />,
});
const ShoppingList = loadable(() => import('@views/ShoppingList'), { fallback: <LoadingPage /> });
const Onboarding = loadable(() => import('@views/Onboarding'), { fallback: <LoadingPage /> });

export const AppContainer = styled.div`
  padding: ${baseSpacer} 0;
  margin-right: auto;
  margin-left: auto;
  max-width: ${breakpoints.xl};
  background-color: ${offWhite};
  // background-color: var(--color-background);
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

  const [showTestSiteModal, setShowTestSiteModal] = useState(
    process.env.GATSBY_SITE_URL === 'https://test.getpackup.com'
  );

  const prevAuthValue = usePrevious(auth.isEmpty);

  useEffect(() => {
    if (auth.isLoaded && auth.isEmpty && prevAuthValue === true) {
      if (location) {
        trackEvent('Attempted Private Page', { location });
        dispatch(addAttemptedPrivatePage(location.pathname));
      }
      navigate('/login');
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
            name: auth.displayName || '',
            created: auth.createdAt,
            username: profile.username,
          });
          Sentry.setUser({
            userId: auth.uid,
            email: auth.email,
            displayName: auth.displayName || '',
          });
        }
      }
      // if no username, lets create a random one for them
      if (
        ((activeLoggedInUser !== undefined && !activeLoggedInUser.username) ||
          activeLoggedInUser === undefined) &&
        isLoaded(profile)
      ) {
        const displayNameDefault =
          auth.displayName?.toLowerCase().replace(/[^0-9a-z]/gi, '') || 'user';
        const generatedUsername = `${displayNameDefault}${Math.floor(
          100000 + Math.random() * 900000
        )}`;
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
            username: generatedUsername,
            bio: '',
            website: '',
            location: '',
            lastUpdated: new Date(),
            profileHeaderImage: '',
          })
          .then(() => {
            trackEvent('User Profile Initial Info Set', {
              uid: auth.uid,
              email: auth.email,
              emailVerified: auth.emailVerified,
              displayName: auth.displayName,
              photoURL: auth.photoURL,
              username: generatedUsername,
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
      <Modal isOpen={showTestSiteModal} toggleModal={() => setShowTestSiteModal(false)}>
        <Heading as="h1">Hold Up! 🛑</Heading>
        <p>
          This is the <strong>TEST</strong> site for Packup, intended only to be used by the Packup
          team for testing purposes.
        </p>
        <p>
          Do you want to stay here, or go to the <strong>LIVE</strong> (actual) site?
        </p>
        <p>
          <Button type="button" onClick={() => setShowTestSiteModal(false)} color="danger" block>
            Stay
          </Button>
        </p>
        <p>
          <Button type="link" to="https://getpackup.com" color="success" block>
            Go to site
          </Button>
        </p>
      </Modal>
      <UpdateConfirmModal />
    </AppContainer>
  );
};
export default App;
