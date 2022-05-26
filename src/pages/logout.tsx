import { LoadingPage, PageContainer, Seo } from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import trackEvent from '@utils/trackEvent';
import { navigate } from 'gatsby';
import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { actionTypes } from 'redux-firestore';

type LogoutProps = {};

const Logout: FunctionComponent<LogoutProps> = () => {
  const dispatch = useDispatch();
  const firebase = useFirebase();

  useEffect(() => {
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
    trackEvent('Logout', { location: 'Logout page' });
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
