import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { UserType } from '@common/user';
import { textColorLight } from '@styles/color';
import { FlexContainer, Avatar } from '.';
import { AvatarProps } from './Avatar';

type UserMediaObjectProps = {
  user: UserType;
  avatarSize?: AvatarProps['size'];
  showSecondaryContent?: boolean;
  action?: JSX.Element;
};

const UserContent = styled.div`
  flex: 1;
`;

const MutedText = styled.small`
  color: ${textColorLight};
`;

const UserMediaObject: FunctionComponent<UserMediaObjectProps> = ({
  user,
  action,
  avatarSize,
  showSecondaryContent,
}) => {
  return (
    <FlexContainer justifyContent="flex-start">
      <Avatar
        src={user.photoURL}
        gravatarEmail={user.email}
        rightMargin
        size={avatarSize || 'sm'}
      />
      <UserContent>
        <div>{user.username}</div>
        {showSecondaryContent && <MutedText>{user.displayName}</MutedText>}
      </UserContent>
      {action}
    </FlexContainer>
  );
};

export default UserMediaObject;
