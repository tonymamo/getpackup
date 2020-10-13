import React, { useEffect, useRef, useState, FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { useSelector } from 'react-redux';
import { Spin as Hamburger } from 'hamburger-react';
import {
  FaCalendar,
  FaChevronLeft,
  FaEllipsisH,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaPlusCircle,
} from 'react-icons/fa';
import { useLocation } from '@reach/router';
import { Helmet } from 'react-helmet-async';

import { PageContainer, FlexContainer, Heading, Button, Box, HorizontalRule } from '.';

import { brandSecondary, brandTertiary, white, brandPrimary } from '../styles/color';
import { halfSpacer, quadrupleSpacer, screenSizes, tripleSpacer } from '../styles/size';
import { headingsFontFamily, fontSizeSmall, fontSizeBase } from '../styles/typography';
import { RootState } from '../redux/ducks';
import useWindowSize from '../utils/useWindowSize';
import yak from '../images/yak.png';

type NavbarProps = {};

const StyledNavbar = styled.header`
  position: fixed;
  left: 0;
  right: 0;
  background: ${brandSecondary};
  min-height: ${quadrupleSpacer};
  line-height: 64px;
  padding-top: env(safe-area-inset-top);
  z-index: 1000;

  & a,
  & a:hover {
    color: ${white};
  }

  & h1 a {
    font-family: ${headingsFontFamily};
    font-size: ${fontSizeSmall};
  }

  & h1 {
    ${(props: { loggedInUser: boolean }) => props.loggedInUser && `font-size: ${fontSizeBase}`};
    color: ${white};
    line-height: ${quadrupleSpacer};
  }
`;

const NavLink = styled(Link)`
  padding: 0 ${halfSpacer};
  &:last-child {
    margin-right: -${halfSpacer};
  }
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
  top: calc(${quadrupleSpacer} + env(safe-area-inset-top));
  right: 0;
  left: 0;
  height: 100vh;
  transition: all 200ms linear;
  line-height: initial;

  & a {
    padding: 0;
    display: block;
    color: ${brandTertiary};
  }

  & a:hover,
  & a:focus {
    color: ${brandPrimary};
    display: block;
  }
`;

const IconLinkWrapper = styled.div`
  display: flex;
  width: ${tripleSpacer};
  & a {
    flex: 1;
  }
`;

const TopNavIconWrapper = styled.nav`
  display: flex;

  & a {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: ${quadrupleSpacer};
    width: ${tripleSpacer};
    color: ${white};
  }

  & a.active {
    color: ${brandPrimary};
  }
`;

const Navbar: FunctionComponent<NavbarProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const { pathname } = useLocation();

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('');

  const onHelmetChange = ({ title }: { title: string }) => {
    if (title !== undefined) {
      setPageTitle(title.replace(' | Adventure made easy.', ''));
    }
  };

  const menuDropdown = useRef<HTMLDivElement>(null);
  const hamburgerButton = useRef<HTMLDivElement>(null);
  const size = useWindowSize();
  const isSmallScreen = Boolean(size && size.width && size.width < screenSizes.medium);

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

  const loggedInUser = auth && auth.isLoaded && !auth.isEmpty;

  const routeHasParent = pathname.split('/').length >= 4;

  const isPartiallyActive = ({ isPartiallyCurrent }: { isPartiallyCurrent: boolean }) => {
    return isPartiallyCurrent ? { className: 'active' } : {};
  };

  return (
    <StyledNavbar role="navigation" aria-label="main-navigation" loggedInUser={loggedInUser}>
      <Helmet onChangeClientState={onHelmetChange} />
      <PageContainer>
        <FlexContainer justifyContent="space-between" alignItems="center" height="100%">
          {!isSmallScreen && (
            <Heading noMargin>
              <Link to={loggedInUser ? '/app/trips' : '/'}>
                <img src={yak} alt="" width={tripleSpacer} /> {loggedInUser ? '' : 'packup'}
              </Link>
            </Heading>
          )}
          {loggedInUser && isSmallScreen && (
            <IconLinkWrapper>
              {routeHasParent && (
                <Link to="../">
                  <FaChevronLeft />
                </Link>
              )}
              {!routeHasParent && pathname === '/app/trips' && (
                <Link to="/app/trips/new">
                  <FaPlusCircle />
                </Link>
              )}
            </IconLinkWrapper>
          )}
          {loggedInUser && isSmallScreen && (
            <Heading noMargin altStyle>
              {pageTitle}
            </Heading>
          )}
          {loggedInUser && isSmallScreen && (
            <IconLinkWrapper>
              {false && (
                <Link to="/app/profile">
                  <FaEllipsisH />
                </Link>
              )}
            </IconLinkWrapper>
          )}
          {isSmallScreen && !loggedInUser && (
            <StyledMenuToggle ref={hamburgerButton}>
              <Hamburger
                color={white}
                toggled={menuIsOpen}
                toggle={() => setMenuIsOpen(!menuIsOpen)}
              />
            </StyledMenuToggle>
          )}

          {isSmallScreen && !loggedInUser && (
            <StyledMenu id="navMenu" menuIsOpen={menuIsOpen} ref={menuDropdown}>
              <Box>
                <NavLink to="/blog" onClick={() => toggleMenu()}>
                  Blog
                </NavLink>
                <HorizontalRule compact />
                <NavLink to="/about" onClick={() => toggleMenu()}>
                  About
                </NavLink>
                <HorizontalRule compact />
                <NavLink to="/contact" onClick={() => toggleMenu()}>
                  Contact
                </NavLink>
                <HorizontalRule compact />
                <NavLink to="/login" onClick={() => toggleMenu()}>
                  Login
                </NavLink>
                <HorizontalRule compact />
                <NavLink to="/signup" onClick={() => toggleMenu()}>
                  Sign Up
                </NavLink>
              </Box>
            </StyledMenu>
          )}
          {!isSmallScreen && !loggedInUser && (
            <FlexContainer as="nav">
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <NavLink to="/login">Login</NavLink>
              <Button type="link" to="/signup">
                Sign Up
              </Button>
            </FlexContainer>
          )}
          {!isSmallScreen && loggedInUser && (
            <TopNavIconWrapper>
              <Link to="/app/trips" getProps={isPartiallyActive}>
                <FaCalendar />
              </Link>
              <Link to="/app/search" getProps={isPartiallyActive}>
                <FaSearch />
              </Link>
              <Link to="/app/shopping-list" getProps={isPartiallyActive}>
                <FaShoppingCart />
              </Link>
              <Link to="/app/profile" getProps={isPartiallyActive}>
                <FaUser />
              </Link>
            </TopNavIconWrapper>
          )}
        </FlexContainer>
      </PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
