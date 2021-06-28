/* eslint-disable no-nested-ternary */
import React, { FunctionComponent } from 'react';
import styled, { CSSProperties } from 'styled-components';

import { white } from '@styles/color';
import useWindowSize from '@utils/useWindowSize';
import { PreviewCompatibleImage } from '@components';
import { FluidImageType } from '@common/image';
import { baseSpacer } from '@styles/size';
import { zIndexNavbar } from '@styles/layers';

type HeroImageProps = {
  imgSrc?: FluidImageType;
  mobileImgSrc?: FluidImageType;
  staticImgSrc?: string;
  aspectRatio?: number;
  justifyContent?: CSSProperties['justifyContent'];
  alignItems?: CSSProperties['alignItems'];
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
  justify-content: ${(props: HeroImageProps) => props.justifyContent || 'center'};
  align-items: ${(props: HeroImageProps) => props.alignItems || 'center'};
  height: 100%;
  text-align: center;
  color: ${white};
  padding: ${baseSpacer};
  z-index: ${zIndexNavbar};

  & h1,
  & p {
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.75);
  }
`;

const HeroImage: FunctionComponent<HeroImageProps> = ({
  imgSrc,
  children,
  mobileImgSrc,
  staticImgSrc,
  aspectRatio,
  justifyContent,
  alignItems,
}) => {
  const size = useWindowSize();

  return (
    <HeroImageWrapper
      aspectRatio={
        aspectRatio || // if a specific aspectRatio is passed in use that, otherwise use fluid image ratios. default to 16/9 if nothing is there
        (size.isExtraSmallScreen && mobileImgSrc
          ? mobileImgSrc.fluid.aspectRatio
          : imgSrc && imgSrc.fluid
          ? imgSrc.fluid.aspectRatio
          : 16 / 9)
      }
    >
      <PreviewCompatibleImage
        imageInfo={{
          image:
            imgSrc || mobileImgSrc // if imgSrc or mobileImgSrc, use one of those, otherwise that means a staticImgSrc was passed in
              ? size.isExtraSmallScreen && mobileImgSrc
                ? (mobileImgSrc as FluidImageType)
                : (imgSrc as FluidImageType)
              : (staticImgSrc as string),
          alt: '',
        }}
      />
      <ChildrenWrapper justifyContent={justifyContent} alignItems={alignItems}>
        {children}
      </ChildrenWrapper>
    </HeroImageWrapper>
  );
};

export default HeroImage;
