import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import PageContainer from './PageContainer';
import FlexContainer from './FlexContainer';
import Heading from './Heading';

import { brandSecondary, white } from '../styles/color';
import { halfSpacer, quadrupleSpacer } from '../styles/size';
import { headingsFontFamily, fontSizeSmall } from '../styles/typography';

type NavbarProps = {};

const StyledNavbar = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  background: ${brandSecondary};
  color: ${white};
  height: ${quadrupleSpacer};
  line-height: ${quadrupleSpacer};
  z-index: 1000;

  & a,
  & a:hover {
    color: ${white};
  }

  & h1 a {
    font-family: ${headingsFontFamily};
    font-size: ${fontSizeSmall};
  }
`;

const NavLink = styled(Link)`
  padding: 0 ${halfSpacer};
  &:last-child {
    margin-right: -${halfSpacer};
  }
`;

const Navbar: FunctionComponent<NavbarProps> = () => {
  return (
    <StyledNavbar role="navigation" aria-label="main-navigation">
      <PageContainer>
        <FlexContainer justifyContent="space-between">
          <Heading noMargin>
            <Link to="/">packup</Link>
          </Heading>
          <nav>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
        </FlexContainer>
      </PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
