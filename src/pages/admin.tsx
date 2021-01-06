import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { useSelector } from 'react-redux';
import { navigate } from 'gatsby';

import { RootState } from '@redux/ducks';
import { PageContainer, PrivateRoute, LoadingPage, ErrorBoundary } from '@components';
import GearList from '@views/Admin/GearList';
import NewGearListItem from '@views/Admin/NewGearListItem';
import EditGearListItem from '@views/Admin/EditGearListItem';

const Admin = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);

  useEffect(() => {
    if (auth.isLoaded && !profile.isAdmin) {
      navigate('/app');
    }
  }, []);

  if (!auth.isLoaded) {
    return <LoadingPage />;
  }

  return (
    <PageContainer withVerticalPadding>
      <ErrorBoundary>
        <Router basepath="/admin" primary={false}>
          <PrivateRoute path="/gear-list" component={GearList} />
          <PrivateRoute path="/gear-list/new" component={NewGearListItem} />
          <PrivateRoute path="/gear-list/:id" component={EditGearListItem} />
        </Router>
      </ErrorBoundary>
    </PageContainer>
  );
};
export default Admin;