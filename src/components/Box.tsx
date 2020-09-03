import React, { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';
import { FluidObject } from 'gatsby-image';

import { baseSpacer, doubleSpacer, quadrupleSpacer, borderRadius } from '../styles/size';
import { white } from '../styles/color';
import { z1Shadow, z2Shadow, z3Shadow, z4Shadow } from '../styles/mixins';

type BoxProps = {
  textAlign?: 'center' | 'left' | 'right';
  height?: number;
  zindex?: 1 | 2 | 3 | 4;
  largePadding?: boolean;
  backgroundAccent?: boolean;
  footer?: JSX.Element;
  bgSrc?: {
    childImageSharp: {
      fluid: FluidObject;
    };
  };
};

const renderShadow = (zindex: number) => {
  if (zindex === 1) {
    return z1Shadow;
  }
  if (zindex === 2) {
    return z2Shadow;
  }
  if (zindex === 3) {
    return z3Shadow;
  }
  if (zindex === 4) {
    return z4Shadow;
  }
  return z1Shadow;
};

const StyledBox = styled.div`
  border-radius: ${borderRadius};
  padding: ${(props: BoxProps) => (props.largePadding ? quadrupleSpacer : baseSpacer)};
  margin-bottom: ${baseSpacer};
  box-shadow: ${(props: BoxProps) => props.zindex && renderShadow(props.zindex)};
  text-align: ${(props: BoxProps) => props.textAlign};
  height: ${(props: BoxProps) =>
    props.height ? `${props.height}px` : `calc(100% - ${baseSpacer})`};
  background: ${(props: BoxProps) =>
    props.bgSrc
      ? `url(${props.bgSrc.childImageSharp.fluid.src}) center center / cover no-repeat`
      : white};
  ${(props: BoxProps) =>
    props.footer &&
    css`
      position: relative;
      padding-bottom: ${quadrupleSpacer};
    `}
`;

const StyledBoxBackground = styled.div`
  background-color: ${white};
  padding: ${doubleSpacer};
`;

const BackgroundImageOverlay = styled.div`
  background-color: rgba(255, 255, 255, 0.75);
  height: 100%;
  padding: ${baseSpacer};
`;

const StyledBoxFooter = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Box: FunctionComponent<BoxProps> = ({
  textAlign,
  height,
  zindex,
  children,
  largePadding,
  backgroundAccent,
  bgSrc,
  footer,
}) => (
  <StyledBox
    bgSrc={bgSrc}
    textAlign={textAlign}
    height={height}
    zindex={zindex}
    largePadding={largePadding}
    footer={footer}
  >
    {bgSrc && !backgroundAccent && <BackgroundImageOverlay>{children}</BackgroundImageOverlay>}
    {!bgSrc && backgroundAccent && <StyledBoxBackground>{children}</StyledBoxBackground>}
    {!bgSrc && !backgroundAccent && children}
    {footer && <StyledBoxFooter>{footer}</StyledBoxFooter>}
  </StyledBox>
);

Box.defaultProps = {
  zindex: 1,
};

export default Box;
