import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useDispatch } from 'react-redux';
import { navigate } from 'gatsby';
import { useFirebase } from 'react-redux-firebase';
import { FaSignOutAlt } from 'react-icons/fa';

import { Button, Heading, Box, Avatar, Seo } from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';

type ProfileProps = {
  user?: firebase.User;
} & RouteComponentProps;

const Profile: FunctionComponent<ProfileProps> = ({ user }) => {
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
    <>
      <Seo title="Profile" />
      {user && (
        <>
          <Heading altStyle>Hello there{user.displayName && `, ${user.displayName}`}!</Heading>
          <Box>
            <Avatar src={user.photoURL as string} size="lg" gravatarEmail={user.email as string} />
            <p>Email: {user.email}</p>
            <p>ID: {user.uid}</p>
            <Button type="button" onClick={logout} iconLeft={<FaSignOutAlt />}>
              Logout
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default Profile;
