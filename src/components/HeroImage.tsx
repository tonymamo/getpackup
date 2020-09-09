import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';

import { white } from '../styles/color';
import { screenSizes } from '../styles/size';
import useWindowSize from '../utils/useWindowSize';

type FullBleedImageProps = {
  imgSrc: string;
  mobileImgSrc?: string;
  height?: string;
  parallax?: boolean;
};

const HeroImageWrapper = styled.div`
  position: relative;
`;

const StyledImage = styled.img`
  max-width: 100%;
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

  & h1 {
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.75);
  }
`;

const FullBleedImage: FunctionComponent<FullBleedImageProps> = ({
  imgSrc,
  children,
  parallax,
  mobileImgSrc,
}) => {
  const size = useWindowSize();
  const isSmallScreen = Boolean(size && size.width && size.width < screenSizes.small);
  const isClient = typeof window === 'object';

  useEffect(() => {
    (async () => {
      if (parallax && typeof window !== 'undefined') {
        const { default: SimpleParallax } = await import('simple-parallax-js');
        const image = document.getElementsByClassName('parallaxImage');
        if (isClient && image) {
          (() => new SimpleParallax(image, { scale: 1.5 }))();
        }
      }
    })();
  });

  return (
    <HeroImageWrapper>
      {isClient ? (
        <StyledImage
          src={isSmallScreen && mobileImgSrc ? mobileImgSrc : imgSrc}
          alt=""
          className={parallax ? 'parallaxImage' : ''}
        />
      ) : (
        <StyledImage src={imgSrc} alt="" />
      )}

      <ChildrenWrapper>{children}</ChildrenWrapper>
    </HeroImageWrapper>
  );
};

export default FullBleedImage;
