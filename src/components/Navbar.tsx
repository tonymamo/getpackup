import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import PageContainer from './PageContainer';

import { brandSecondary, white } from '../styles/color';
import { quadrupleSpacer } from '../styles/size';
import { headingsFontFamily } from '../styles/typography';

type NavbarProps = {};

const StyledNavbar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  background: ${brandSecondary};
  color: ${white};
  height: ${quadrupleSpacer};
  line-height: ${quadrupleSpacer};
  z-index: 1;

  & a,
  & a:hover {
    color: ${white};
  }

  & h1 a {
    font-family: ${headingsFontFamily};
    letter-spacing: 1px;
  }
`;

const Navbar: FunctionComponent<NavbarProps> = () => {
  return (
    <StyledNavbar role="navigation" aria-label="main-navigation">
      <PageContainer>
        <h1>
          <Link to="/">packup</Link>
        </h1>
      </PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
