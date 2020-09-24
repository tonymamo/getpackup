import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import { Heading, PageContainer, Box, Avatar, Button } from '../components';

type ProfileProps = {
  user: firebase.User;
} & RouteComponentProps;

const Profile: FunctionComponent<ProfileProps> = ({ user }) => {
  return (
    <PageContainer withVerticalPadding>
      <Box>
        <Heading>Hello there{user.displayName && `, ${user.displayName}`}!</Heading>
        <Avatar src={user.photoURL as string} size="lg" gravatarEmail={user.email as string} />
        <p>Email: {user.email}</p>
        <p>ID: {user.uid}</p>
        {user.emailVerified && (
          <Button type="button" onClick={() => user.sendEmailVerification()}>
            verify email
          </Button>
        )}
      </Box>
    </PageContainer>
  );
};

export default Profile;
