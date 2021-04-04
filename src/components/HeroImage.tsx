import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { white } from '@styles/color';
import useWindowSize from '@utils/useWindowSize';
import { PreviewCompatibleImage } from '@components';
import { FluidImageType } from '@common/image';

type HeroImageProps = {
  imgSrc: FluidImageType;
  mobileImgSrc?: FluidImageType;
};

const HeroImageWrapper = styled.div`
  position: relative;
  min-height: ${(props: { aspectRatio: number }) => `calc(100vw / ${props.aspectRatio})`};
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

  & h1,
  & p {
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.75);
  }
`;

const HeroImage: FunctionComponent<HeroImageProps> = ({ imgSrc, children, mobileImgSrc }) => {
  const size = useWindowSize();

  return (
    <HeroImageWrapper
      aspectRatio={
        // eslint-disable-next-line no-nested-ternary
        size.isExtraSmallScreen && mobileImgSrc
          ? mobileImgSrc.fluid.aspectRatio
          : imgSrc.fluid
          ? imgSrc.fluid.aspectRatio
          : 16 / 9
      }
    >
      <PreviewCompatibleImage
        imageInfo={{
          image: size.isExtraSmallScreen && mobileImgSrc ? mobileImgSrc : imgSrc,
          alt: '',
        }}
      />
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </HeroImageWrapper>
  );
};

export default HeroImage;
