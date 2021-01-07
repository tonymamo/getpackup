import React, { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';
import { FluidObject } from 'gatsby-image';

import {
  baseSpacer,
  breakpoints,
  doubleSpacer,
  quadrupleSpacer,
  borderRadiusRound,
} from '@styles/size';
import { white } from '@styles/color';
import { baseBorderStyle, z1Shadow, z2Shadow, z3Shadow, z4Shadow } from '@styles/mixins';

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
  onClick?: () => void;
  roundedCorners?: boolean;
};

const renderShadow = (zindex: number) => {
  switch (zindex) {
    case 1:
      return z1Shadow;
    case 2:
      return z2Shadow;
    case 3:
      return z3Shadow;
    case 4:
      return z4Shadow;
    default:
      return z1Shadow;
  }
};

const StyledBox = styled.div<BoxProps>`
  ${({ roundedCorners }) => (roundedCorners ? `border-radius: ${borderRadiusRound};` : '')}
  padding: ${baseSpacer};
  margin-bottom: ${baseSpacer};
  border: ${baseBorderStyle};
  /* box-shadow: ${(props) => props.zindex && renderShadow(props.zindex)}; */
  text-align: ${(props) => props.textAlign};
  height: ${(props) => (props.height ? `${props.height}px` : `calc(100% - ${baseSpacer})`)};
  background: ${(props) =>
    props.bgSrc
      ? `url(${props.bgSrc.childImageSharp.fluid.src}) center center / cover no-repeat`
      : white};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'initial')};
  transition: all 0.2s ease-in-out;
  ${(props) =>
    props.footer &&
    css`
      position: relative;
      padding-bottom: ${quadrupleSpacer};
    `}

  &:hover {
    /* box-shadow: ${(props) => props.zindex && props.onClick && renderShadow(props.zindex + 1)}; */
  }

  @media only screen and (min-width: ${breakpoints.sm}) {
    padding: ${(props) => (props.largePadding ? quadrupleSpacer : doubleSpacer)};
  }

  @media only screen and (min-width: ${breakpoints.md}) {
    padding: ${(props) => (props.largePadding ? quadrupleSpacer : baseSpacer)};
  }
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
  ...rest
}) => (
  <StyledBox
    bgSrc={bgSrc}
    textAlign={textAlign}
    height={height}
    zindex={zindex}
    largePadding={largePadding}
    footer={footer}
    {...rest}
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
