import React from 'react';
import { Router } from '@reach/router';
import { useSelector } from 'react-redux';

import { RootState } from '@redux/ducks';
import { PrivateRoute, LoadingPage, ErrorBoundary } from '@components';
import GearList from '@views/Admin/GearList';
import NewGearListItem from '@views/Admin/NewGearListItem';
import EditGearListItem from '@views/Admin/EditGearListItem';
import Actions from '@views/Admin/Actions';
import { AppContainer } from './app';

const Admin = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const loggedInUser = useSelector((state: RootState) => state.firestore.ordered.loggedInUser);
  const activeLoggedInUser = loggedInUser && loggedInUser.length > 0 ? loggedInUser[0] : undefined;

  if (!auth.isLoaded || !loggedInUser || !profile.isAdmin) {
    return <LoadingPage />;
  }

  return (
    <AppContainer>
      <ErrorBoundary>
        <Router basepath="/admin">
          <PrivateRoute path="/actions" component={Actions} loggedInUser={activeLoggedInUser} />
          <PrivateRoute path="/gear-list" component={GearList} loggedInUser={activeLoggedInUser} />
          <PrivateRoute
            path="/gear-list/new"
            component={NewGearListItem}
            loggedInUser={activeLoggedInUser}
          />
          <PrivateRoute
            path="/gear-list/:id"
            component={EditGearListItem}
            loggedInUser={activeLoggedInUser}
          />
        </Router>
      </ErrorBoundary>
    </AppContainer>
  );
};
export default Admin;
