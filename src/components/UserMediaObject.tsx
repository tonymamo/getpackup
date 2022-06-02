import { UserType } from '@common/user';
import { textColorLight } from '@styles/color';
import { halfSpacer } from '@styles/size';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { AvatarProps } from './Avatar';
import { Avatar, FlexContainer } from '.';

type UserMediaObjectProps = {
  user: UserType;
  avatarSize?: AvatarProps['size'];
  showSecondaryContent?: boolean;
  action?: JSX.Element;
};

const UserContent = styled.div`
  flex: 1;
  margin-right: ${halfSpacer};
  line-height: 1.2;
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
    <FlexContainer justifyContent="flex-start" flexWrap="nowrap">
      <Avatar
        src={user.photoURL}
        gravatarEmail={user.email}
        rightMargin
        size={avatarSize || 'sm'}
      />
      <UserContent>
        <div style={{ wordBreak: 'break-all' }}>{user.username?.toLocaleLowerCase()}</div>
        {showSecondaryContent && <MutedText>{user.displayName}</MutedText>}
      </UserContent>
      {action}
    </FlexContainer>
  );
};

export default UserMediaObject;
