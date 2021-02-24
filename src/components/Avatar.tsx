import React, { FunctionComponent } from 'react';
import styled, { CSSProperties } from 'styled-components';
import { FluidObject } from 'gatsby-image';
import { Md5 } from 'ts-md5/dist/md5';

import {
  baseAndAHalfSpacer,
  baseSpacer,
  doubleSpacer,
  halfSpacer,
  quadrupleSpacer,
  sextupleSpacer,
  borderRadiusCircle,
  octupleSpacer,
} from '@styles/size';
import { lightestGray } from '@styles/color';
import { PreviewCompatibleImage } from '@components';
import { zIndexAvatarImageAfter } from '@styles/layers';
import { fontSizeSmall } from '@styles/typography';

type AvatarProps = {
  src?:
    | {
        childImageSharp: { fluid: FluidObject };
      }
    | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  gravatarEmail?: string;
  bottomMargin?: boolean;
  rightMargin?: boolean;
  staticContent?: string;
  style?: CSSProperties;
};

const renderSize = (size: AvatarProps['size']) => {
  switch (size) {
    case 'xs':
      return baseAndAHalfSpacer;
    case 'sm':
      return doubleSpacer;
    case 'md':
      return quadrupleSpacer;
    case 'lg':
      return sextupleSpacer;
    case 'xl':
      return octupleSpacer;
    default:
      return doubleSpacer;
  }
};

const AvatarImageWrapper = styled.div`
  border-radius: ${borderRadiusCircle};
  overflow: hidden;
  object-fit: cover;
  display: flex;
  height: ${(props: AvatarProps) => props.size && renderSize(props.size)};
  width: ${(props) => props.size && renderSize(props.size)};
  /* min-width ensures it doesnt get resized when in a flexed parent */
  min-width: ${(props) => props.size && renderSize(props.size)};
  ${(props) => props.bottomMargin && `margin-bottom: ${baseSpacer};`}
  ${(props) =>
    props.rightMargin &&
    `margin-right: ${
      props.size === 'md' || props.size === 'lg' ? baseSpacer : halfSpacer
    };`}

  /* If image fails to load, provide some fallback styling to make it look better */
  & img {
    position: relative;
  }

  & img:after {
    content: '👤';
    font-size: ${(props) => renderSize(props.size)};
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: ${zIndexAvatarImageAfter};
    top: 0;
    left: 0;
    width: 100%;
    height: 120%; /* slightly bigger to have emoji fully cover up bottom of avatar circle */
    background-color: ${lightestGray};
  }
`;

const StaticContentWrapper = styled.div`
  background-color: ${lightestGray};
  height: ${(props: AvatarProps) => props.size && renderSize(props.size)};
  width: ${(props) => props.size && renderSize(props.size)};
  /* min-width ensures it doesnt get resized when in a flexed parent */
  min-width: ${(props) => props.size && renderSize(props.size)};
  position: relative;
  justify-content: center;
  align-items: center;
  font-size: ${fontSizeSmall};
`;

export const StackedAvatars = styled.div`
  display: flex;

  & ${AvatarImageWrapper}, & ${StaticContentWrapper} {
    margin-right: -${halfSpacer};
    display: inline-flex;
  }
`;

const Avatar: FunctionComponent<AvatarProps> = (props) => {
  // https://en.gravatar.com/site/implement/images/
  // hash users email address with md5
  // default to an identicon and
  // size of 192px(sextupleSpacer * 2x)
  const gravatarUrl =
    props.gravatarEmail &&
    `https://www.gravatar.com/avatar/${Md5.hashStr(props.gravatarEmail)}?d=identicon&s=192`;
  return (
    <AvatarImageWrapper
      size={props.size || 'sm'}
      bottomMargin={props.bottomMargin || false}
      rightMargin={props.rightMargin || false}
      style={props.style}
      {...props}
    >
      {props.staticContent && (!props.src || !gravatarUrl) ? (
        <StaticContentWrapper size={props.size || 'sm'}>
          <small>{props.staticContent}</small>
        </StaticContentWrapper>
      ) : (
        <PreviewCompatibleImage
          imageInfo={{
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            image: (props.src || gravatarUrl)!,
            alt: 'user profile picture',
          }}
        />
      )}
    </AvatarImageWrapper>
  );
};
export default Avatar;
