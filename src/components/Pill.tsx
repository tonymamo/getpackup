import React, { FunctionComponent, CSSProperties } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import {
  brandPrimary,
  brandPrimaryHover,
  white,
  lightestGray,
  textColor,
  brandDanger,
  brandSuccess,
  brandInfo,
} from '@styles/color';
import { threeQuarterSpacer, doubleSpacer, quarterSpacer } from '@styles/size';
import { fontSizeSmall } from '@styles/typography';

type PillProps = {
  to?: string;
  text: string;
  color: 'neutral' | 'primary' | 'danger' | 'success' | 'info';
  style?: CSSProperties;
};

const renderColor = (color: PillProps['color']) => {
  switch (color) {
    case 'neutral':
      return {
        backgroundColor: lightestGray,
        hoverBackgroundColor: lightestGray,
        color: textColor,
      };
    case 'primary':
      return {
        backgroundColor: brandPrimary,
        hoverBackgroundColor: brandPrimaryHover,
        color: white,
      };
    case 'danger':
      return {
        backgroundColor: brandDanger,
        hoverBackgroundColor: brandDanger,
        color: white,
      };
    case 'success':
      return {
        backgroundColor: brandSuccess,
        hoverBackgroundColor: brandSuccess,
        color: white,
      };
    case 'info':
      return {
        backgroundColor: brandInfo,
        hoverBackgroundColor: brandInfo,
        color: white,
      };
    default:
      return {
        backgroundColor: brandPrimary,
        hoverBackgroundColor: brandPrimaryHover,
        color: white,
      };
  }
};

const StyledPill = styled.span`
  display: inline-block;
  padding: ${quarterSpacer} ${threeQuarterSpacer};
  background-color: ${(props: { color: PillProps['color'] }) =>
    props.color && renderColor(props.color).backgroundColor};
  border-radius: ${doubleSpacer};
  margin: ${quarterSpacer};
  transition: all 0.2s ease-in-out;
  color: ${(props) => props.color && renderColor(props.color).color};
  line-height: 1.5;

  &:hover {
    background-color: ${(props) => props.color && renderColor(props.color).hoverBackgroundColor};
  }
`;

const StyledLink = styled(Link)`
  display: block;
  color: ${white};
  font-size: ${fontSizeSmall};
  transition: all 0.2s ease-in-out;

  &:hover,
  &:focus {
    color: ${white};
  }
`;

const Pill: FunctionComponent<PillProps> = (props) => {
  return (
    <StyledPill {...props}>
      <small>{props.to ? <StyledLink to={props.to}>{props.text}</StyledLink> : props.text}</small>
    </StyledPill>
  );
};

export default Pill;
