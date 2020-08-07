import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import PageContainer from './PageContainer';

import { brandPrimary, white } from '../styles/color';
import { quadrupleSpacer, baseSpacer } from '../styles/size';

type NavbarProps = {};

const StyledNavbar = styled.nav`
  background: ${brandPrimary};
  color: ${white};
  height: ${quadrupleSpacer};
  padding: ${baseSpacer} 0;
`;

const Navbar: FunctionComponent<NavbarProps> = () => {
  return (
    <StyledNavbar role="navigation" aria-label="main-navigation">
      <PageContainer>Packup</PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
