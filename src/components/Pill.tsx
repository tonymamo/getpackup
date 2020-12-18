import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import { brandPrimary, brandPrimaryHover, white } from '@styles/color';
import { baseSpacer, doubleSpacer, quarterSpacer } from '@styles/size';
import { fontSizeSmall } from '@styles/typography';

type PillProps = {
  to: string;
  text: string;
};

const StyledPill = styled.li`
  list-style: none;
  display: inline-block;
  padding: ${quarterSpacer} ${baseSpacer};
  background-color: ${brandPrimary};
  border-radius: ${doubleSpacer};
  margin: ${quarterSpacer};
  transition: all 0.2s ease-in-out;

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
    <StyledPill>
      <small>
        <StyledLink to={props.to}>{props.text}</StyledLink>
      </small>
    </StyledPill>
  );
};

export default Pill;
