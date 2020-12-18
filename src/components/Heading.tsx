import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { baseSpacer } from '@styles/size';
import { headingsColor, white } from '@styles/color';
import {
  fontSizeH1,
  fontSizeH2,
  fontSizeH3,
  fontSizeH4,
  fontSizeH5,
  fontSizeH6,
  lineHeightSmall,
} from '@styles/typography';

type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  inverse?: boolean;
  noMargin?: boolean;
  align?: 'left' | 'center' | 'right';
  id?: string;
  uppercase?: boolean;
};

const renderFontSize = (as: HeadingProps['as']) => {
  if (as === 'h1') {
    return fontSizeH1;
  }
  if (as === 'h2') {
    return fontSizeH2;
  }
  if (as === 'h3') {
    return fontSizeH3;
  }
  if (as === 'h4') {
    return fontSizeH4;
  }
  if (as === 'h5') {
    return fontSizeH5;
  }
  if (as === 'h6') {
    return fontSizeH6;
  }
  return fontSizeH1;
};

const StyledHeading = styled.h1`
  font-weight: 700;
  line-height: ${lineHeightSmall};
  color: ${(props: HeadingProps) => (props.inverse ? white : headingsColor)};
  margin-bottom: ${(props: HeadingProps) => (props.noMargin ? '0' : baseSpacer)};
  text-align: ${(props: HeadingProps) => props.align};
  white-space: pre-line;
  font-size: ${(props: HeadingProps) => props.as && renderFontSize(props.as)};
  text-transform: ${(props: HeadingProps) => (props.uppercase ? 'uppercase' : 'initial')};
  & div {
    display: inline;
  }
`;

const Heading: FunctionComponent<HeadingProps> = (props) => (
  <StyledHeading
    as={props.as}
    noMargin={props.noMargin}
    inverse={props.inverse}
    align={props.align}
    id={props.id}
    uppercase={props.uppercase}
  >
    {props.children}
  </StyledHeading>
);

export default Heading;
