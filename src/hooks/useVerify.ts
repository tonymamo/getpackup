import { navigate } from 'gatsby';
import { useEffect } from 'react';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch } from 'react-redux';

import { addAlert } from '@redux/ducks/globalAlerts';

const useVerify = (actionCode?: string) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof actionCode !== 'string') return;

    firebase
      .auth()
      .applyActionCode(actionCode)
      .then(() => {
        dispatch(
          addAlert({
            type: 'success',
            message: 'Your email address was verified',
          })
        );
      })
      .catch((error: Error) => {
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
  }, [actionCode, firebase, dispatch]);
};

export default useVerify;
