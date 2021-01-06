import React, { useEffect, useState } from 'react';
import { Router } from '@reach/router';
import { useSelector } from 'react-redux';
import { navigate } from 'gatsby';
import { useFirebase } from 'react-redux-firebase';

import { RootState } from '@redux/ducks';
import { PrivateRoute, LoadingPage, ErrorBoundary } from '@components';
import GearList from '@views/Admin/GearList';
import NewGearListItem from '@views/Admin/NewGearListItem';
import EditGearListItem from '@views/Admin/EditGearListItem';
import { AppContainer } from './app';

const Admin = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  // TODO: common type
  const [loggedInUser, setLoggedInUser] = useState<{
    displayName: string;
    photoURL: string;
    email: string;
    bio: string;
    website: string;
    isAdmin: boolean;
  } | null>(null);
  const firebase = useFirebase();

  const getLoggedInUser = async () => {
    const response = await firebase
      .firestore()
      .collection('users')
      .where('uid', '==', auth.uid)
      .limit(1)
      .get();
    if (!response.empty) {
      setLoggedInUser(response.docs[0].data());
    }
  };

  useEffect(() => {
    if (auth.uid) {
      getLoggedInUser();
    }
    if (auth.isLoaded && loggedInUser && !loggedInUser?.isAdmin) {
      navigate('/app');
    }
  }, [auth]);

  if (!auth.isLoaded || !loggedInUser) {
    return <LoadingPage />;
  }

  return (
    <AppContainer>
      <ErrorBoundary>
        <Router basepath="/admin" primary={false}>
          <PrivateRoute path="/gear-list" component={GearList} loggedInUser={loggedInUser} />
          <PrivateRoute
            path="/gear-list/new"
            component={NewGearListItem}
            loggedInUser={loggedInUser}
          />
          <PrivateRoute
            path="/gear-list/:id"
            component={EditGearListItem}
            loggedInUser={loggedInUser}
          />
        </Router>
      </ErrorBoundary>
    </AppContainer>
  );
};
export default Admin;
