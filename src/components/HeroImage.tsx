import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import SimpleParallax from 'simple-parallax-js';

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
`;

const FullBleedImage: FunctionComponent<FullBleedImageProps> = ({ imgSrc, children, parallax }) => {
  useEffect(() => {
    if (parallax && window && typeof window === 'object') {
      const image = document.getElementsByClassName('parallaxImage');
      (() => new SimpleParallax(image, { orientation: 'left', delay: 0.5 }))();
    }
  });

  return (
    <HeroImageWrapper>
      <StyledImage src={imgSrc} alt="" className={parallax ? 'parallaxImage' : ''} />
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </HeroImageWrapper>
  );
};

export default FullBleedImage;
