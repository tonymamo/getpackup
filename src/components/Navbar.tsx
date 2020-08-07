import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import PageContainer from './PageContainer';

import { brandPrimary, white } from '../styles/color';
import { quadrupleSpacer } from '../styles/size';

type NavbarProps = {};

const StyledNavbar = styled.nav`
  background: ${brandPrimary};
  color: ${white};
  height: ${quadrupleSpacer};
`;

const Navbar: FunctionComponent<NavbarProps> = () => {
  return (
    <StyledNavbar role="navigation" aria-label="main-navigation">
      <PageContainer>hello</PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
