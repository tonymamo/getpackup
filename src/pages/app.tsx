import React from 'react';
import { navigate } from 'gatsby';
import { Router } from '@reach/router';
import firebase from 'gatsby-plugin-firebase';

import Profile from '../views/Profile';
import Trips from '../views/Trips';

import useAuthState from '../utils/useFirebaseAuth';

const App = () => {
  const [user, loading, error] = useAuthState(firebase);

  if ((!user && !loading) || error) {
    navigate('/login');
  }
  if (user && user.email) {
    return (
      <Router basepath="/app">
        <Profile path="/profile" user={user} />
        <Trips path="/trips" />
      </Router>
    );
  }
  return null;
};
export default App;