import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import PageContainer from './PageContainer';
import FlexContainer from './FlexContainer';
import Heading from './Heading';

import { brandSecondary, white } from '../styles/color';
import { quadrupleSpacer } from '../styles/size';
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
  z-index: 1;

  & a,
  & a:hover {
    color: ${white};
  }

  & h1 a {
    font-family: ${headingsFontFamily};
    letter-spacing: 1px;
    font-size: ${fontSizeSmall};
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
            <Link to="/blog">Blog</Link>
          </nav>
        </FlexContainer>
      </PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
