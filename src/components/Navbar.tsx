import {
  Badges,
  Box,
  Button,
  FlexContainer,
  Heading,
  HorizontalRule,
  PageContainer,
} from '@components';
import yak from '@images/yak.svg';
import { brandPrimary, brandSecondary, brandTertiary, white } from '@styles/color';
import { zIndexNavbar } from '@styles/layers';
import { baseSpacer, quadrupleSpacer, quarterSpacer, tripleSpacer } from '@styles/size';
import { fontSizeBase, fontSizeH3, fontSizeSmall, headingsFontFamily } from '@styles/typography';
import trackEvent from '@utils/trackEvent';
import useWindowSize from '@utils/useWindowSize';
import { Link } from 'gatsby';
import { Spin as Hamburger } from 'hamburger-react';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

type NavbarProps = {};

const StyledNavbar = styled.header`
  position: fixed;
  left: 0;
  right: 0;
  background: ${brandSecondary};
  min-height: ${quadrupleSpacer};
  padding-top: env(safe-area-inset-top);
  z-index: ${zIndexNavbar};
  display: flex;
  align-items: center;

  & a,
  & a:hover,
  & a:focus,
  & a:active {
    font-family: ${headingsFontFamily};
    font-weight: 700;
    color: ${white};
  }

  & a:focus {
    outline: 1px dotted ${brandPrimary};
  }

  & h1 a {
    font-family: ${headingsFontFamily};
    font-size: ${fontSizeSmall};
    font-weight: 700;
  }

  & h2 {
    font-size: ${fontSizeBase};
    color: ${white};
    line-height: ${quadrupleSpacer};
  }

  // & sup {
  //   text-transform: uppercase;
  //   font-size: 0.5em;
  //   top: -1em;
  //   padding: ${quarterSpacer};
  //   border-radius: ${baseSpacer};
  //   background-color: ${white};
  //   color: ${brandSecondary};
  // }

  & svg:focus {
    outline: none;
  }
`;

const NavLink = styled(Link)`
  padding: ${baseSpacer} 0;
  font-size: ${fontSizeH3};
  text-transform: uppercase;
`;

const NavLinkA = styled.a`
  padding: ${baseSpacer} 0;
  font-size: ${fontSizeH3};
  text-transform: uppercase;
`;

const StyledMenuToggle = styled.div`
  cursor: pointer;
  width: ${quadrupleSpacer};
  height: ${quadrupleSpacer};
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledMenu = styled.nav`
  position: absolute;
  transform: translateX(${(props: { menuIsOpen: boolean }) => (props.menuIsOpen ? 0 : '100vw')});
  top: ${quadrupleSpacer};
  right: 0;
  left: 0;
  height: 100vh;
  transition: all 0.2s ease-in-out;
  line-height: initial;

  & a,
  & a:visited {
    display: block;
    color: ${brandTertiary};
  }

  & a:hover,
  & a:focus {
    color: ${brandPrimary};
    display: block;
  }
`;

const Navbar: FunctionComponent<NavbarProps> = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const menuDropdown = useRef<HTMLDivElement>(null);
  const hamburgerButton = useRef<HTMLDivElement>(null);
  const size = useWindowSize();

  const handleProfileDropownClick = (e: MouseEvent) => {
    if (menuDropdown && menuDropdown.current && menuDropdown.current.contains(e.target as Node)) {
      return; // inside click
    }
    if (
      hamburgerButton &&
      hamburgerButton.current &&
      hamburgerButton.current.contains(e.target as Node)
    ) {
      return; // let event bubble to Hamburger toggle method
    }
    setMenuIsOpen(false); // outside click, close the menu
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleProfileDropownClick);

    return () => {
      document.removeEventListener('mousedown', handleProfileDropownClick);
    };
  }, []);

  const toggleMenu = () => {
    setMenuIsOpen(false);
  };

  return (
    <StyledNavbar role="navigation" aria-label="main-navigation">
      <PageContainer>
        <FlexContainer justifyContent="space-between" alignItems="center">
          {!size.isSmallScreen && (
            <Heading noMargin>
              <Link to="/" onClick={() => trackEvent('Navbar Logo Clicked', {})}>
                <img src={yak} alt="" width={tripleSpacer} height={27} />{' '}
                {size.isSmallScreen ? '' : <>packup</>}
              </Link>
            </Heading>
          )}
          {size.isSmallScreen && (
            <Heading noMargin>
              <Link to="/" onClick={() => trackEvent('Navbar SmallScreen Logo Clicked', {})}>
                <img src={yak} alt="" width={tripleSpacer} />
                packup
              </Link>
            </Heading>
          )}

          {size.isSmallScreen && (
            <StyledMenuToggle ref={hamburgerButton}>
              <Hamburger
                color={white}
                toggled={menuIsOpen}
                toggle={() => {
                  trackEvent('Navbar Hamburger Toggled');
                  setMenuIsOpen(!menuIsOpen);
                }}
              />
            </StyledMenuToggle>
          )}

          {size.isSmallScreen && (
            <StyledMenu id="navMenu" menuIsOpen={menuIsOpen} ref={menuDropdown}>
              <Box>
                <NavLink
                  to="/blog"
                  onClick={() => {
                    trackEvent('Navbar SmallScreen Link Clicked', { link: 'Blog' });
                    toggleMenu();
                  }}
                >
                  Blog
                </NavLink>
                <HorizontalRule compact />
                <NavLink
                  to="/about"
                  onClick={() => {
                    trackEvent('Navbar SmallScreen Link Clicked', { link: 'About' });
                    toggleMenu();
                  }}
                >
                  About
                </NavLink>
                <HorizontalRule compact />
                <NavLink
                  to="/contact"
                  onClick={() => {
                    trackEvent('Navbar SmallScreen Link Clicked', { link: 'Contact' });
                    toggleMenu();
                  }}
                >
                  Contact
                </NavLink>
                <HorizontalRule compact />
                <NavLinkA
                  href="https://packupapp.com/login"
                  onClick={() => {
                    trackEvent('Navbar SmallScreen Link Clicked', { link: 'Login' });
                    toggleMenu();
                  }}
                >
                  Log In
                </NavLinkA>
                <HorizontalRule compact />
                <NavLinkA
                  href="https://packupapp.com/signup"
                  onClick={() => {
                    trackEvent('Navbar SmallScreen Link Clicked', { link: 'Sign Up' });
                    toggleMenu();
                  }}
                >
                  Sign Up
                </NavLinkA>
                <HorizontalRule compact />
                <Badges />
              </Box>
            </StyledMenu>
          )}
          {!size.isSmallScreen && (
            <FlexContainer as="nav">
              <Button type="link" to="https://packupapp.com/login" color="secondary">
                Log In
              </Button>
              &nbsp;
              <Button type="link" to="https://packupapp.com/signup">
                Sign Up
              </Button>
            </FlexContainer>
          )}
        </FlexContainer>
      </PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
