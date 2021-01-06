import React, { ComponentType, FunctionComponent, useEffect } from 'react';
import { navigate } from 'gatsby';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, WindowLocation } from '@reach/router';

import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';
import { addAttemptedPrivatePage } from '@redux/ducks/client';

type PrivateRouteProps = {
  location?: WindowLocation;
  component: ComponentType & RouteComponentProps;
  path: string;
  loggedInUser: {
    // TODO: common type
    displayName: string;
    photoURL: string;
    email: string;
    bio: string;
    website: string;
    isAdmin: boolean;
  };
};

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({
  location,
  component: Component,
  loggedInUser,
  ...rest
}) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (auth.isLoaded && auth.isEmpty) {
      if (location) {
        dispatch(addAttemptedPrivatePage(location.pathname));
      }
      navigate('/login');
      dispatch(
        addAlert({
          type: 'danger',
          message: 'Please log in to access that page',
        })
      );
    }
  }, []);

  if ((auth.isLoaded && auth.isEmpty) || !auth) {
    navigate('/');
    return null;
  }
  return <Component loggedInUser={loggedInUser} {...rest} />;
};

export default PrivateRoute;
