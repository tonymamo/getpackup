import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { quarterSpacer, quadrupleSpacer } from '../styles/size';
import { white } from '../styles/color';

type FullBleedImageProps = {
  imgSrc: string;
  height?: string;
};

const StyledFullBleedImage = styled.div`
  background-image: ${(props: FullBleedImageProps) => `url(${props.imgSrc})`};
  background-position: top center;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  height: ${(props: FullBleedImageProps) => props.height || `calc(100vh - ${quadrupleSpacer})`};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-shadow: 0 0 ${quarterSpacer} rgba(0, 0, 0, 0.5);
  color: ${white};
`;

const FullBleedImage: FunctionComponent<FullBleedImageProps> = ({ imgSrc, children, height }) => (
  <StyledFullBleedImage imgSrc={imgSrc} height={height}>
    {children}
  </StyledFullBleedImage>
);

export default FullBleedImage;
