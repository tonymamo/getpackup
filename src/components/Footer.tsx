import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

import {
  PageContainer,
  Row,
  Column,
  HorizontalRule,
  FlexContainer,
  Heading,
  SignupForm
} from '@components';

import { brandPrimary, brandSecondary, white } from '@styles/color';
import { baseSpacer, doubleSpacer, quadrupleSpacer } from '@styles/size';
import { fontSizeSmall } from '@styles/typography';
import { visuallyHiddenStyle } from '@styles/mixins';

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

const HiddenText = styled.span`
  ${visuallyHiddenStyle};
`;

const SignupFormWrapper = styled.div`
  padding: ${doubleSpacer} 0;
  background-color: ${brandPrimary};
`;

const Footer = () => (
  <>
    <SignupFormWrapper id="signup">
      <PageContainer>
        <Heading as="h1" inverse align="center">
          Be the first to know
        </Heading>
        <p style={{ textAlign: 'center', color: white }}>
          Enter your email to be notified when our beta is available
        </p>
        <Row>
          <Column md={8} mdOffset={2}>
            <SignupForm location="footer" />
          </Column>
        </Row>
      </PageContainer>
    </SignupFormWrapper>
    <StyledFooter>
      <PageContainer>
        <Row>
          <Column md={3} lg={6}>
            <Heading>
              <Link to="/">packup</Link>
            </Heading>
            <p>Adventure made easy.</p>
          </Column>
          <Column sm={4} md={3} lg={2}>
            <p>
              <Link to="/">Home</Link>
            </p>
            <p>
              <Link to="/#learn-more">Sign Up</Link>
            </p>
          </Column>
          <Column sm={4} md={3} lg={2}>
            <p>
              <Link to="/blog">Blog</Link>
            </p>
            <p>
              <Link to="/about">About</Link>
            </p>
          </Column>
          <Column sm={4} md={3} lg={2}>
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
            <Social href="https://www.instagram.com/getpackup/" target="_blank" rel="noopener">
              <FaInstagram />
              <HiddenText>Instagram</HiddenText>
            </Social>
            <Social href="https://www.facebook.com/getpackup" target="_blank" rel="noopener">
              <FaFacebook />
              <HiddenText>Facebook</HiddenText>
            </Social>
            <Social href="https://twitter.com/getpackup" target="_blank" rel="noopener">
              <FaTwitter />
              <HiddenText>Twitter</HiddenText>
            </Social>
          </nav>
          <small>{`Copyright © Packup ${new Date().getFullYear()}`}</small>
        </FlexContainer>
      </PageContainer>
    </StyledFooter>
  </>
);

export default Footer;
