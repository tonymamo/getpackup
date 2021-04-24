import { FluidObject } from 'gatsby-image';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { white } from '@styles/color';
import { screenSizes, doubleSpacer } from '@styles/size';
import useWindowSize from '@utils/useWindowSize';
import { ClientOnly, PreviewCompatibleImage } from '@components';

type FullBleedImageProps = {
  imgSrc:
    | {
        childImageSharp: {
          fluid: FluidObject;
        };
      }
    | string;
  mobileImgSrc?: {
    childImageSharp: {
      fluid: FluidObject;
    };
  };
};

const HeroImageWrapper = styled.div`
  position: relative;
  min-height: 200px;
`;

const ChildrenWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  color: ${white};
  padding: 0 ${doubleSpacer};

  & h1,
  & p {
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.75);
  }
`;

const FullBleedImage: FunctionComponent<FullBleedImageProps> = ({
  imgSrc,
  children,
  mobileImgSrc,
}) => {
  const size = useWindowSize();
  const isSmallScreen = Boolean(size && size.width && size.width < screenSizes.small);

  return (
    <HeroImageWrapper>
      <ClientOnly>
        <PreviewCompatibleImage
          imageInfo={{
            image: isSmallScreen && mobileImgSrc ? mobileImgSrc : imgSrc,
            alt: '',
          }}
        />
      </ClientOnly>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </HeroImageWrapper>
  );
};

export default FullBleedImage;
