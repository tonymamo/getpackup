import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';

import { white } from '../styles/color';

type FullBleedImageProps = {
  imgSrc: string;
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

const FullBleedImage: FunctionComponent<FullBleedImageProps> = ({ imgSrc, children, parallax }) => {
  useEffect(() => {
    (async () => {
      if (parallax && typeof window !== 'undefined') {
        const { default: SimpleParallax } = await import('simple-parallax-js');
        const isClient = typeof window === 'object';
        const image = document.getElementsByClassName('parallaxImage');
        if (isClient && image) {
          (() => new SimpleParallax(image, { delay: 0.5 }))();
        }
      }
    })();
  });

  return (
    <HeroImageWrapper>
      <StyledImage src={imgSrc} alt="" className={parallax ? 'parallaxImage' : ''} />
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </HeroImageWrapper>
  );
};

export default FullBleedImage;
