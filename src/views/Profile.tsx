import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from 'gatsby';
import { useFirebase } from 'react-redux-firebase';
import { FaSignOutAlt } from 'react-icons/fa';

import { Button, Heading, Box, Avatar, Seo, PageContainer } from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';

type ProfileProps = {} & RouteComponentProps;

const Profile: FunctionComponent<ProfileProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();
  const dispatch = useDispatch();

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
  };

  return (
    <PageContainer withVerticalPadding>
      <Seo title="Profile" />
      {auth && (
        <>
          <Heading altStyle>Hello there{auth.displayName && `, ${auth.displayName}`}!</Heading>
          <Box>
            <Avatar src={auth.photoURL as string} size="lg" gravatarEmail={auth.email as string} />
            <p>Email: {auth.email}</p>
            <p>ID: {auth.uid}</p>
            <Button type="button" onClick={logout} iconLeft={<FaSignOutAlt />}>
              Logout
            </Button>
          </Box>
        </>
      )}
    </PageContainer>
  );
};

export default Profile;
