import { UserType } from '@common/user';
import { LoadingPage } from '@components';
import { RouteComponentProps, WindowLocation } from '@reach/router';
import { RootState } from '@redux/ducks';
import { addAttemptedPrivatePage } from '@redux/ducks/client';
import trackEvent from '@utils/trackEvent';
import { navigate } from 'gatsby';
import React, { ComponentType, FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type PrivateRouteProps = {
  location?: WindowLocation;
  component: ComponentType & RouteComponentProps;
  path: string;
  loggedInUser: UserType;
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
        trackEvent('Attempted Private Page', { location });
        dispatch(addAttemptedPrivatePage(location.pathname));
      }
      navigate('/login');
    }
  }, [auth]);

  if ((auth.isLoaded && auth.isEmpty) || !auth) {
    return <LoadingPage />;
  }
  return <Component loggedInUser={loggedInUser} {...rest} />;
};

export default PrivateRoute;
