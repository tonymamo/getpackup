import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import {
  baseSpacer,
  baseAndAHalfSpacer,
  doubleSpacer,
  sextupleSpacer,
  quadrupleSpacer,
} from '../styles/size';
import profilePic from '../images/profile-pic.svg';

type AvatarProps = {
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  bottomMargin?: boolean;
};

const renderSize = (size: AvatarProps['size']) => {
  if (size === 'xs') {
    return baseAndAHalfSpacer;
  }
  if (size === 'sm') {
    return doubleSpacer;
  }
  if (size === 'md') {
    return quadrupleSpacer;
  }
  if (size === 'lg') {
    return sextupleSpacer;
  }
  return doubleSpacer;
};

const AvatarImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  height: ${(props: AvatarProps) => props.size && renderSize(props.size)};
  width: ${(props: AvatarProps) => props.size && renderSize(props.size)};
  ${(props: AvatarProps) => props.bottomMargin && `margin-bottom: ${baseSpacer}`}
`;

const Avatar: FunctionComponent<AvatarProps> = (props) => (
  <AvatarImage
    src={props.src || profilePic}
    size={props.size || 'sm'}
    bottomMargin={props.bottomMargin || false}
  />
);

export default Avatar;
