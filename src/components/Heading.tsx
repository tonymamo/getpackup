import { headingsColor, white } from '@styles/color';
import { baseSpacer } from '@styles/size';
import {
  fontFamilySansSerif,
  fontSizeBase,
  fontSizeH1,
  fontSizeH2,
  fontSizeH3,
  fontSizeH4,
  fontSizeH5,
  fontSizeH6,
  fontSizeSmall,
  headingsFontFamily,
  lineHeightSmall,
} from '@styles/typography';
import React, { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  inverse?: boolean;
  noMargin?: boolean;
  align?: 'left' | 'center' | 'right';
  id?: string;
  uppercase?: boolean;
  altStyle?: boolean;
  onClick?: () => void;
  withDecoration?: boolean;
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

const StyledHeading = styled.h1<HeadingProps>`
  font-weight: 700;
  line-height: ${lineHeightSmall};
  color: ${(props) => (props.inverse ? white : headingsColor)};
  margin-bottom: ${(props) => (props.noMargin ? '0' : baseSpacer)};
  text-align: ${(props) => props.align};
  white-space: pre-line;
  font-size: ${(props) => renderFontSize(props.as, props.altStyle)};
  text-transform: ${(props) => (props.uppercase ? 'uppercase' : 'initial')};
  font-family: ${(props) => (props.altStyle ? fontFamilySansSerif : headingsFontFamily)};
  & div {
    display: inline;
  }

  ${(props) =>
    props.withDecoration &&
    css`
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      text-align: center;

      &:before,
      &:after {
        content: '';
        border-top: 1px solid;
        margin: 0 ${baseSpacer} 0 0;
        flex: 1 0 ${baseSpacer};
      }

      &:after {
        margin: 0 0 0 ${baseSpacer};
      }
    `}
`;

const Heading: FunctionComponent<HeadingProps> = (props) => (
  <StyledHeading {...props}>{props.children}</StyledHeading>
);

export default Heading;
