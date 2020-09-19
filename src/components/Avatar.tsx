import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { FluidObject } from 'gatsby-image';

import {
  baseSpacer,
  baseAndAHalfSpacer,
  doubleSpacer,
  sextupleSpacer,
  quadrupleSpacer,
} from '../styles/size';
import profilePic from '../images/profile-pic.svg';
import PreviewCompatibleImage from './PreviewCompatibleImage';

type AvatarProps = {
  src?:
    | {
        childImageSharp: { fluid: FluidObject };
      }
    | string;
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

const AvatarImageWrapper = styled.div`
  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
  height: ${(props: AvatarProps) => props.size && renderSize(props.size)};
  width: ${(props: AvatarProps) => props.size && renderSize(props.size)};
  ${(props: AvatarProps) => props.bottomMargin && `margin-bottom: ${baseSpacer}`}
`;

const Avatar: FunctionComponent<AvatarProps> = (props) => (
  <AvatarImageWrapper size={props.size || 'sm'} bottomMargin={props.bottomMargin || false}>
    <PreviewCompatibleImage
      imageInfo={{
        image: props.src || profilePic,
        alt: 'user profile picture',
      }}
    />
  </AvatarImageWrapper>
);

export default Avatar;
