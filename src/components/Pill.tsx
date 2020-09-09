import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import { brandPrimary, white, brandPrimaryHover } from '../styles/color';
import { doubleSpacer, quarterSpacer, halfSpacer, baseSpacer } from '../styles/size';
import { fontSizeSmall } from '../styles/typography';

type PillProps = {
  to: string;
  text: string;
};

const StyledPill = styled.li`
  list-style: none;
  display: inline-block;

  & + & {
    margin-left: ${halfSpacer};
  }
`;

const StyledLink = styled(Link)`
  background-color: ${brandPrimary};
  border-radius: ${doubleSpacer};
  padding: ${quarterSpacer} ${baseSpacer};
  color: ${white};
  font-size: ${fontSizeSmall};

  &:hover,
  &:focus {
    color: ${white};
    background-color: ${brandPrimaryHover};
  }
`;

const Pill: FunctionComponent<PillProps> = (props) => {
  return (
    <StyledPill>
      <StyledLink to={props.to}>{props.text}</StyledLink>
    </StyledPill>
  );
};

export default Pill;
