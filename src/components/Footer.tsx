import React from 'react';
import styled from 'styled-components';

import PageContainer from './PageContainer';
import FlexContainer from './FlexContainer';

import { brandSecondary, white } from '../styles/color';
import { quadrupleSpacer } from '../styles/size';

const StyledFooter = styled.footer`
  background-color: ${brandSecondary};
  color: ${white};
  height: ${quadrupleSpacer};
  line-height: ${quadrupleSpacer};
  & a {
    color: ${white};

    &:hover,
    &:focus {
      color: ${white};
    }
  }
`;

const Footer = () => (
  <StyledFooter>
    <PageContainer>
      <FlexContainer flexDirection="column">
        <small>{`Copyright © Packup ${new Date().getFullYear()}`}</small>
      </FlexContainer>
    </PageContainer>
  </StyledFooter>
);

export default Footer;
