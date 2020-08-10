import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import PageContainer from './PageContainer';

import { brandPrimary, white } from '../styles/color';
import { quadrupleSpacer } from '../styles/size';
import { headingsFontFamily } from '../styles/typography';

type NavbarProps = {};

const StyledNavbar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  background: ${brandPrimary};
  color: ${white};
  height: ${quadrupleSpacer};
  line-height: ${quadrupleSpacer};
  z-index: 1;

  & a,
  & a:hover {
    color: ${white};
    font-family: ${headingsFontFamily};
  }
`;

const Navbar: FunctionComponent<NavbarProps> = () => {
  return (
    <StyledNavbar role="navigation" aria-label="main-navigation">
      <PageContainer>
        <Link to="/">packup</Link>
      </PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
