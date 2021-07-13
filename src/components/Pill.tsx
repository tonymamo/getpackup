import React, { FunctionComponent, CSSProperties } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import { brandPrimary, brandPrimaryHover, white, lightestGray, textColor } from '@styles/color';
import { threeQuarterSpacer, doubleSpacer, quarterSpacer } from '@styles/size';
import { fontSizeSmall } from '@styles/typography';

type PillProps = {
  to?: string;
  text: string;
  color?: 'neutral' | 'primary';
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
    <StyledPill color={props.color} style={props.style}>
      <small>{props.to ? <StyledLink to={props.to}>{props.text}</StyledLink> : props.text}</small>
    </StyledPill>
  );
};

export default Pill;
