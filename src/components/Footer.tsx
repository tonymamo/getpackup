import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

import PageContainer from './PageContainer';
import FlexContainer from './FlexContainer';

import { brandTertiary, white } from '../styles/color';
import { baseSpacer, doubleSpacer } from '../styles/size';

import logo from '../images/logo.svg';

const StyledFooter = styled.footer`
  background-color: ${brandTertiary};
  color: ${white};
  padding: ${baseSpacer};

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
        {/* TODO for PROD: update to / */}
        <Link to="/landing" title="Logo">
          <img src={logo} alt="Realty Offer" height={doubleSpacer} /> RealtyOffer
        </Link>
        <small>
          {`Copyright © ${new Date().getFullYear()} | `}
          <Link to="/terms">Terms</Link>
          {' | '}
          <Link to="/privacy">Privacy</Link>
        </small>
      </FlexContainer>
    </PageContainer>
  </StyledFooter>
);

export default Footer;
