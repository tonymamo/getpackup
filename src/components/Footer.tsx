import { Badges, Button, Column, FlexContainer, Heading, PageContainer, Row } from '@components';
import mountainScene from '@images/mountain-scene.png';
import { brandSecondary, white } from '@styles/color';
import { visuallyHiddenStyle } from '@styles/mixins';
import { baseSpacer, halfSpacer, tripleSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import { Link } from 'gatsby';
import React from 'react';
import { FaFacebook, FaInstagram, FaReddit } from 'react-icons/fa';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  color: ${white};
  width: 100%;
  position: relative;
  z-index: 1;
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

const Section = styled.section<{ background?: string }>`
  background-color: ${(props) => props.background || 'transparent'};
  position: relative;
  min-height: 100vh;
`;

const Footer = () => {
  return (
    <Section background={brandSecondary}>
      <FlexContainer
        justifyContent="space-evenly"
        flexDirection="column"
        height="100vh"
        alignItems="center"
      >
        <PageContainer>
          <div style={{ textAlign: 'center' }}>
            <Heading as="h1" inverse align="center">
              Plan your first trip today
            </Heading>

            <Button type="link" to="https://packupapp.com/signup">
              Get Started
            </Button>
          </div>
        </PageContainer>
        <PageContainer>
          <StyledFooter>
            <Row>
              <Column md={3} lg={6}>
                <Heading>
                  <Link to="/">packup</Link>
                </Heading>
                <p>Get outside faster and safer.</p>
                <nav>
                  <Social
                    href="https://www.instagram.com/getpackup/"
                    target="_blank"
                    rel="noopener"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Instagram' })}
                  >
                    <FaInstagram />
                    <HiddenText>Instagram</HiddenText>
                  </Social>
                  <Social
                    href="https://www.facebook.com/getpackup"
                    target="_blank"
                    rel="noopener"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Facebook' })}
                  >
                    <FaFacebook />
                    <HiddenText>Facebook</HiddenText>
                  </Social>
                  <Social
                    href="https://reddit.com/r/packup"
                    target="_blank"
                    rel="noopener"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Reddit' })}
                  >
                    <FaReddit />
                    <HiddenText>Reddit</HiddenText>
                  </Social>
                </nav>
                <small>
                  <Link
                    to="/privacy"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Privacy' })}
                  >
                    Privacy
                  </Link>
                  {' | '}
                  <Link
                    to="/terms"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Terms of Use' })}
                  >
                    Terms of Use
                  </Link>
                  <br />
                  {`Copyright © Packup Technologies, Ltd. ${new Date().getFullYear()}`}
                </small>
              </Column>
              <Column sm={4} md={3} lg={2}>
                <p>
                  <Link to="/" onClick={() => trackEvent('Footer Link Click', { link: 'Home' })}>
                    Home
                  </Link>
                </p>
                <p>
                  <a
                    href="https://packupapp.com"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Sign Up' })}
                  >
                    Sign Up
                  </a>
                </p>
              </Column>
              <Column sm={4} md={3} lg={2}>
                <p>
                  <Link
                    to="/blog"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Blog' })}
                  >
                    Blog
                  </Link>
                </p>
                <p>
                  <Link
                    to="/about"
                    onClick={() => trackEvent('Footer Link Click', { link: 'About' })}
                  >
                    About
                  </Link>
                </p>
              </Column>
              <Column sm={4} md={3} lg={2}>
                <p>
                  <Link
                    to="/contact"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Send a message' })}
                  >
                    Send a Message
                  </Link>
                </p>
                <p>
                  <a
                    href="https://reddit.com/r/packup"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Reddit' })}
                  >
                    Community
                  </a>
                </p>
              </Column>
            </Row>
            <div style={{ marginTop: tripleSpacer }}>
              <Badges />
            </div>
          </StyledFooter>
        </PageContainer>
      </FlexContainer>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundImage: `url(${mountainScene})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100%',
          backgroundPosition: 'bottom center',
          padding: halfSpacer,
          display: 'flex',
          alignItems: 'flex-end',
          height: '100vh',
          zIndex: 0,
        }}
      />
    </Section>
  );
};
export default Footer;
