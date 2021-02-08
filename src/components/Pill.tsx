import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import { brandPrimary, brandPrimaryHover, white, lightestGray, textColor } from '@styles/color';
import { doubleSpacer, quarterSpacer, threeQuarterSpacer } from '@styles/size';
import { fontSizeSmall } from '@styles/typography';

type PillProps = {
  to?: string;
  text: string;
  color?: 'neutral' | 'primary';
};

const StyledPill = styled.span`
  display: inline-block;
  padding: ${quarterSpacer} ${threeQuarterSpacer};
  background-color: ${(props: { color: PillProps['color'] }) =>
    props.color === 'neutral' ? lightestGray : brandPrimary};
  border-radius: ${doubleSpacer};
  margin: ${quarterSpacer};
  transition: all 0.2s ease-in-out;
  color: ${(props) => (props.color === 'neutral' ? textColor : white)};

  &:hover {
    background-color: ${brandPrimaryHover};
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
    <StyledPill color={props.color}>
      <small>{props.to ? <StyledLink to={props.to}>{props.text}</StyledLink> : props.text}</small>
    </StyledPill>
  );
};

export default Pill;
