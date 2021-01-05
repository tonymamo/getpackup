import React, { FunctionComponent, useEffect } from 'react';
import { navigate } from 'gatsby';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { actionTypes } from 'redux-firestore';

import { PageContainer, LoadingPage, Seo } from '@components';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';

type LogoutProps = {};

const Logout: FunctionComponent<LogoutProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const dispatch = useDispatch();
  const firebase = useFirebase();

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
    // clear redux store http://react-redux-firebase.com/docs/auth.html#logout
    firebase.logout().then(() => {
      // https://github.com/prescottprue/redux-firestore/issues/114
      dispatch({ type: actionTypes.CLEAR_DATA });
    });
  };

  useEffect(() => {
    if (!auth.isEmpty) {
      logout();
      if (window && window.analytics) {
        window.analytics.track('Logout', {
          location: 'Logout page',
        });
      }
    }
    navigate('/');
  }, []);

  return (
    <PageContainer>
      <Seo title="Log Out" />
      <LoadingPage />
    </PageContainer>
  );
};

export default Logout;
