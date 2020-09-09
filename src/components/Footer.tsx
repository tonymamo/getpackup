import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

import PageContainer from './PageContainer';
import Row from './Row';
import Column from './Column';
import HorizontalRule from './HorizontalRule';
import FlexContainer from './FlexContainer';

import { brandSecondary, white } from '../styles/color';
import { quadrupleSpacer, baseSpacer } from '../styles/size';
import { fontSizeSmall } from '../styles/typography';

const StyledFooter = styled.footer`
  background-color: ${brandSecondary};
  color: ${white};
  padding: ${quadrupleSpacer} 0;
  font-size: ${fontSizeSmall};
  & a {
    color: ${white};
    opacity: 0.8;

    &:hover,
    &:focus {
      color: ${white};
      opacity: 1;
    }
  }
`;

const Social = styled.a`
  margin-right: ${baseSpacer};
`;

const Footer = () => (
  <StyledFooter>
    <PageContainer>
      <Row>
        <Column md={3} lg={6}>
          <h1>
            <Link to="/">packup</Link>
          </h1>
          <p>Adventure made easy.</p>
        </Column>
        <Column sm={4} md={3} lg={2}>
          <p>Product</p>
          <p>
            <Link to="/">Learn More</Link>
          </p>
          <p>
            <Link to="/#signup">Sign Up</Link>
          </p>
        </Column>
        <Column sm={4} md={3} lg={2}>
          <p>Company</p>
          <p>
            <Link to="/blog">Blog</Link>
          </p>
          <p>
            <Link to="/about">About</Link>
          </p>
        </Column>
        <Column sm={4} md={3} lg={2}>
          <p>Contact</p>
          <p>
            <a href="mailto:hello@getpackup.com">hello@getpackup.com</a>
          </p>
          <p>
            <Link to="/contact">Send a Message</Link>
          </p>
        </Column>
      </Row>
      <HorizontalRule />
      <FlexContainer justifyContent="space-between">
        <nav>
          <Social href="https://www.facebook.com/getpackup" target="_blank">
            <FaFacebook />
          </Social>
          <Social href="https://twitter.com/getpackup" target="_blank">
            <FaTwitter />
          </Social>
          <Social href="https://www.instagram.com/getpackup/" target="_blank">
            <FaInstagram />
          </Social>
        </nav>
        <small>{`Copyright © Packup ${new Date().getFullYear()}`}</small>
      </FlexContainer>
    </PageContainer>
  </StyledFooter>
);

export default Footer;
