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
  headingsFontFamily,
  fontFamilySansSerif,
  fontSizeBase,
  fontSizeSmall,
} from '@styles/typography';

type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  inverse?: boolean;
  noMargin?: boolean;
  align?: 'left' | 'center' | 'right';
  id?: string;
  uppercase?: boolean;
  altStyle?: boolean;
  onClick?: () => void;
};

const renderFontSize = (as: HeadingProps['as'], altStyle: HeadingProps['altStyle']) => {
  if (as === 'h1') {
    return altStyle ? fontSizeH3 : fontSizeH1;
  }
  if (as === 'h2') {
    return altStyle ? fontSizeH4 : fontSizeH2;
  }
  if (as === 'h3') {
    return altStyle ? fontSizeH5 : fontSizeH3;
  }
  if (as === 'h4') {
    return altStyle ? fontSizeH6 : fontSizeH4;
  }
  if (as === 'h5') {
    return altStyle ? fontSizeBase : fontSizeH5;
  }
  if (as === 'h6') {
    return altStyle ? fontSizeSmall : fontSizeH6;
  }
  return altStyle ? fontSizeH3 : fontSizeH1;
};

const StyledHeading = styled.h1`
  font-weight: 700;
  line-height: ${lineHeightSmall};
  color: ${(props: HeadingProps) => (props.inverse ? white : headingsColor)};
  margin-bottom: ${(props: HeadingProps) => (props.noMargin ? '0' : baseSpacer)};
  text-align: ${(props: HeadingProps) => props.align};
  white-space: pre-line;
  font-size: ${(props: HeadingProps) => renderFontSize(props.as, props.altStyle)};
  text-transform: ${(props: HeadingProps) => (props.uppercase ? 'uppercase' : 'initial')};
  font-family: ${(props: HeadingProps) =>
    props.altStyle ? fontFamilySansSerif : headingsFontFamily};
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
    altStyle={props.altStyle}
    {...props}
  >
    {props.children}
  </StyledHeading>
);

export default Heading;
