import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import SimpleParallax from 'simple-parallax-js';

import { white } from '../styles/color';
import ClientOnly from './ClientOnly';

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
`;

const FullBleedImage: FunctionComponent<FullBleedImageProps> = ({ imgSrc, children, parallax }) => {
  useEffect(() => {
    if (parallax && typeof window !== 'undefined') {
      const image = window && document.getElementsByClassName('parallaxImage');
      (() => new SimpleParallax(image, { orientation: 'left', delay: 0.5 }))();
    }
  });

  return (
    <HeroImageWrapper>
      {typeof window !== 'undefined' ? (
        <ClientOnly>
          <StyledImage src={imgSrc} alt="" className="parallaxImage" />
        </ClientOnly>
      ) : (
        <StyledImage src={imgSrc} alt="" />
      )}

      <ChildrenWrapper>{children}</ChildrenWrapper>
    </HeroImageWrapper>
  );
};

export default FullBleedImage;
