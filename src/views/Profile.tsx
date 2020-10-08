import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import { Heading, Box, Avatar, Seo } from '../components';

type ProfileProps = {
  user?: firebase.User;
} & RouteComponentProps;

const Profile: FunctionComponent<ProfileProps> = ({ user }) => {
  return (
    <>
      <Seo title="Profile" />
      {user && (
        <Box>
          <Heading>Hello there{user.displayName && `, ${user.displayName}`}!</Heading>
          <Avatar src={user.photoURL as string} size="lg" gravatarEmail={user.email as string} />
          <p>Email: {user.email}</p>
          <p>ID: {user.uid}</p>
        </Box>
      )}
    </>
  );
};

export default Profile;
