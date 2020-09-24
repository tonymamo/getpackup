import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import firebase from 'gatsby-plugin-firebase';

import { Heading, PageContainer, Box, Avatar } from '../components';

type ProfileProps = {
  user: firebase.User;
} & RouteComponentProps;

const Profile: FunctionComponent<ProfileProps> = ({ user }) => {
  return (
    <PageContainer withVerticalPadding>
      <Box>
        <Heading>Hello there, {user.displayName}!</Heading>
        <Avatar src={user.photoURL as string} size="lg" />
        <p>Email: {user.email}</p>
        <p>ID: {user.uid}</p>
      </Box>
    </PageContainer>
  );
};

export default Profile;
