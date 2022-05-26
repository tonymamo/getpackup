import { FluidImageType } from '@common/image';
import { PreviewCompatibleImage } from '@components';
import { lightestGray, white } from '@styles/color';
import { zIndexAvatarImageAfter } from '@styles/layers';
import {
  baseSpacer,
  borderRadiusCircle,
  doubleSpacer,
  halfSpacer,
  octupleSpacer,
  quadrupleSpacer,
  sextupleSpacer,
  tripleSpacer,
} from '@styles/size';
import { fontSizeSmall } from '@styles/typography';
import React, { FunctionComponent } from 'react';
import ReactTooltip from 'react-tooltip';
import styled, { CSSProperties } from 'styled-components';
import { Md5 } from 'ts-md5/dist/md5';

export type AvatarProps = {
  src?: FluidImageType | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  gravatarEmail?: string;
  bottomMargin?: boolean;
  rightMargin?: boolean;
  staticContent?: string;
  style?: CSSProperties;
  username?: string;
};

const renderSize = (size: AvatarProps['size']) => {
  switch (size) {
    case 'xs':
      return doubleSpacer;
    case 'sm':
      return tripleSpacer;
    case 'md':
      return quadrupleSpacer;
    case 'lg':
      return sextupleSpacer;
    case 'xl':
      return octupleSpacer;
    default:
      return tripleSpacer;
  }
};

export const AvatarImageWrapper = styled.div`
  border-radius: ${borderRadiusCircle};
  overflow: hidden;
  object-fit: cover;
  display: flex;
  background-color: ${lightestGray};
  height: ${(props: AvatarProps) => props.size && renderSize(props.size)};
  width: ${(props) => props.size && renderSize(props.size)};
  /* min-width ensures it doesnt get resized when in a flexed parent */
  min-width: ${(props) => props.size && renderSize(props.size)};
  ${(props) => props.bottomMargin && `margin-bottom: ${baseSpacer};`}
  ${(props) =>
    props.rightMargin &&
    `margin-right: ${props.size === 'md' || props.size === 'lg' ? baseSpacer : halfSpacer};`}

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
  position: relative;
  text-align: center;
  font-size: ${fontSizeSmall};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StackedAvatars = styled.div`
  display: flex;
  margin: ${halfSpacer} 0;

  & ${AvatarImageWrapper} {
    margin-right: -${halfSpacer};
    display: inline-flex;
    border: 2px solid ${white};
    z-index: ${zIndexAvatarImageAfter};
    transition: transform 0.1s ease-out 0s;
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
    >
      {props.staticContent && (!props.src || !gravatarUrl) ? (
        <>
          <StaticContentWrapper
            size={props.size || 'sm'}
            data-tip={`${props.staticContent} more`}
            data-for="static-avatar"
          >
            <small>{props.staticContent}</small>
          </StaticContentWrapper>
          <ReactTooltip
            id="static-avatar"
            place="top"
            type="dark"
            effect="solid"
            className="tooltip customTooltip"
          />
        </>
      ) : (
        <>
          <PreviewCompatibleImage
            imageInfo={{
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              image: (props.src || (gravatarUrl as string))!,
              alt: 'user profile picture',
            }}
            width={renderSize(props.size)}
            height={renderSize(props.size)}
          />
        </>
      )}
    </AvatarImageWrapper>
  );
};
export default Avatar;
