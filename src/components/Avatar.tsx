import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { FluidObject } from 'gatsby-image';
import { Md5 } from 'ts-md5/dist/md5';

import {
  baseSpacer,
  baseAndAHalfSpacer,
  doubleSpacer,
  sextupleSpacer,
  quadrupleSpacer,
} from '../styles/size';
import PreviewCompatibleImage from './PreviewCompatibleImage';

type AvatarProps = {
  src?:
    | {
        childImageSharp: { fluid: FluidObject };
      }
    | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  gravatarEmail: string;
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
  display: flex;
  height: ${(props: { size: AvatarProps['size']; bottomMargin: AvatarProps['bottomMargin'] }) =>
    props.size && renderSize(props.size)};
  width: ${(props) => props.size && renderSize(props.size)};
  ${(props) => props.bottomMargin && `margin-bottom: ${baseSpacer}`}
`;

const Avatar: FunctionComponent<AvatarProps> = (props) => {
  // https://en.gravatar.com/site/implement/images/
  // hash users email address with md5
  // default to an identicon and
  // size of 192px(sextupleSpacer * 2x)
  const gravatarUrl = `https://www.gravatar.com/avatar/${Md5.hashStr(
    props.gravatarEmail
  )}?d=identicon&s=192`;
  return (
    <AvatarImageWrapper size={props.size || 'sm'} bottomMargin={props.bottomMargin || false}>
      <PreviewCompatibleImage
        imageInfo={{
          image: props.src || gravatarUrl,
          alt: 'user profile picture',
        }}
      />
    </AvatarImageWrapper>
  );
};
export default Avatar;
