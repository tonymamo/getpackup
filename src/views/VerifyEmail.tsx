import { navigate } from 'gatsby';
import React, { useEffect } from 'react';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';

import { addAlert } from '@redux/ducks/globalAlerts';
import { baseSpacer } from '@styles/size';
import { LoadingSpinner } from '@components';
import trackEvent from '@utils/trackEvent';

type VerifyEmailProps = { actionCode: string };

const VerifyEmail = ({ actionCode }: VerifyEmailProps) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof actionCode !== 'string') return;

    firebase
      .auth()
      .applyActionCode(actionCode)
      .then(() => {
        trackEvent('Email Address Verified');
      })
      .catch((error: Error) => {
        trackEvent('Email Address Verification Failure', { error });
        dispatch(
          addAlert({
            type: 'danger',
            message: error.message,
          })
        );
      })
      .finally(() => {
        navigate('/');
      });
  }, [actionCode]);

  return (
    <>
      <LoadingSpinner theme="dark" style={{ display: 'inline-block', marginRight: baseSpacer }} />
      Verifying your email address
    </>
  );
};

export default VerifyEmail;
