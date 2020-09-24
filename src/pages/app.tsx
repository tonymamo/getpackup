import React from 'react';
import { navigate } from 'gatsby';
import { Router } from '@reach/router';
import firebase from 'gatsby-plugin-firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import Profile from '../views/Profile';

const App = () => {
  const [user] = useAuthState(firebase.auth());

  if (!user) {
    navigate('/login');
    return null;
  }
  return (
    <Router basepath="/app">
      <Profile path="/profile" user={user} />
    </Router>
  );
};
export default App;
