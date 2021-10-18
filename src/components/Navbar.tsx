import React, { useEffect, useRef, useState, FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link, navigate } from 'gatsby';
import { useSelector } from 'react-redux';
import { Spin as Hamburger } from 'hamburger-react';
import { FaCalendar, FaChevronLeft, FaUserLock } from 'react-icons/fa';
import { useLocation } from '@reach/router';
import { Helmet } from 'react-helmet-async';
import { useFirestoreConnect } from 'react-redux-firebase';
import ReactTooltip from 'react-tooltip';
import { setScrollPosition } from '@utils/setScrollPosition';

import {
  Avatar,
  PageContainer,
  FlexContainer,
  Heading,
  Button,
  Box,
  HorizontalRule,
} from '@components';
import { brandSecondary, brandTertiary, white, brandPrimary } from '@styles/color';
import { baseSpacer, halfSpacer, quadrupleSpacer, quarterSpacer, tripleSpacer } from '@styles/size';
import { headingsFontFamily, fontSizeSmall, fontSizeBase } from '@styles/typography';
import { RootState } from '@redux/ducks';
import useWindowSize from '@utils/useWindowSize';
import yak from '@images/yak.svg';
import GearClosetIcon from '@images/gearClosetIcon';
import { zIndexNavbar } from '@styles/layers';
import trackEvent from '@utils/trackEvent';
import { AvatarImageWrapper } from './Avatar';
import { ScrollTimeout } from '../enums';

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
  & a:visited,
  & a:active {
    font-family: ${headingsFontFamily};
    font-weight: 700;
    color: ${white};
  }

  & a:focus {
    outline: 1px dotted ${brandPrimary};
    opacity: 0.8;
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

  & sup {
    text-transform: uppercase;
    font-size: 0.5em;
    top: -1em;
    padding: ${quarterSpacer};
    border-radius: ${baseSpacer};
    background-color: ${white};
    color: ${brandSecondary};
  }

  & svg:focus {
    outline: none;
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
  top: ${quadrupleSpacer};
  right: 0;
  left: 0;
  height: 100vh;
  transition: all 0.2s ease-in-out;
  line-height: initial;

  & a,
  & a:visited {
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
    display: flex;
    justify-content: center;
    align-items: center;
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
    transition: all 0.2s ease-in-out;
  }

  & a:focus,
  & a:active {
    outline: 1px dotted ${brandPrimary};
    opacity: 0.8;
  }

  & a.active,
  & a.active:visited {
    color: ${brandPrimary};
  }

  /* active avatar border */
  & a.active ${AvatarImageWrapper} {
    box-shadow: 0px 0px 0px 2px ${brandSecondary}, 0px 0px 0px 4px ${brandPrimary};
  }
`;

const Navbar: FunctionComponent<NavbarProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const loggedInUser = useSelector((state: RootState) => state.firestore.ordered.loggedInUser);

  useFirestoreConnect([
    { collection: 'users', where: ['uid', '==', auth.uid || ''], storeAs: 'loggedInUser' },
  ]);

  const { pathname } = useLocation();

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('');

  const onHelmetChange = ({ title }: { title: string }) => {
    if (title !== undefined) {
      setPageTitle(title.replace(' | Packup', ''));
    }
  };

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

  const isAuthenticated = auth && !auth.isEmpty;

  const truncatedPageTitle = pageTitle.length > 25 ? `${pageTitle.substring(0, 25)}...` : pageTitle;
  const routeHasParent = pathname.split('/').length >= 4;

  // TODO: better way to do this?
  // if on a checklist or gear closet item page, we want to be able to do navigate(-1) on the back button below
  const checklistOrGearClosetItemRegex = new RegExp('/checklist|gear-closet|gear-list/*');
  const routeIsChecklistOrGearClosetItem = checklistOrGearClosetItemRegex.test(pathname);

  const tripGenRegex = new RegExp('/add-trip-image|generator');
  const routeIsPartOfTripGenProcess = tripGenRegex.test(pathname);

  const isInOnboardingFlow = pathname.includes('onboarding');

  const isPartiallyActive = ({ isPartiallyCurrent }: { isPartiallyCurrent: boolean }) => {
    return isPartiallyCurrent ? { className: 'active' } : {};
  };

  return (
    <StyledNavbar role="navigation" aria-label="main-navigation">
      <Helmet onChangeClientState={onHelmetChange} />
      <PageContainer>
        <FlexContainer justifyContent="space-between" alignItems="center">
          {!size.isSmallScreen && auth.isLoaded && (
            <Heading noMargin>
              <Link
                to={isAuthenticated ? '/app/trips' : '/'}
                onClick={() => trackEvent('Navbar Logo Clicked', { isAuthenticated })}
              >
                <img src={yak} alt="" width={tripleSpacer} height={27} />{' '}
                {size.isSmallScreen && !isAuthenticated ? (
                  ''
                ) : (
                  <>
                    packup<sup>beta</sup>
                  </>
                )}
              </Link>
            </Heading>
          )}
          {size.isSmallScreen && auth.isLoaded && !isAuthenticated && (
            <Heading noMargin>
              <Link
                to="/"
                onClick={() => trackEvent('Navbar SmallScreen Logo Clicked', { isAuthenticated })}
              >
                <img src={yak} alt="" width={tripleSpacer} />
                packup<sup>beta</sup>
              </Link>
            </Heading>
          )}
          {isAuthenticated && size.isSmallScreen && auth.isLoaded && (
            <IconLinkWrapper>
              {routeHasParent && !routeIsPartOfTripGenProcess && (
                <Link
                  to="../"
                  onClick={() => {
                    trackEvent('Navbar SmallScreen Back Button Clicked');
                    if (routeIsChecklistOrGearClosetItem) {
                      setTimeout(() => setScrollPosition(), ScrollTimeout.default);
                      navigate(-1);
                    }
                  }}
                >
                  <FaChevronLeft />
                </Link>
              )}
            </IconLinkWrapper>
          )}
          {isAuthenticated && size.isSmallScreen && auth.isLoaded && (
            <Heading noMargin altStyle as="h2">
              {truncatedPageTitle}
            </Heading>
          )}
          {isAuthenticated && size.isSmallScreen && auth.isLoaded && <IconLinkWrapper />}
          {size.isSmallScreen && !isAuthenticated && auth.isLoaded && (
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

          {size.isSmallScreen && !isAuthenticated && auth.isLoaded && (
            <StyledMenu id="navMenu" menuIsOpen={menuIsOpen} ref={menuDropdown}>
              <Box>
                <NavLink
                  to="/install"
                  onClick={() => {
                    trackEvent('Navbar SmallScreen Link Clicked', { link: 'Install' });
                    toggleMenu();
                  }}
                >
                  Get the App
                </NavLink>
                <HorizontalRule compact />
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
                <NavLink
                  to="/login"
                  onClick={() => {
                    trackEvent('Navbar SmallScreen Link Clicked', { link: 'Login' });
                    toggleMenu();
                  }}
                >
                  Log In
                </NavLink>
                <HorizontalRule compact />
                <NavLink
                  to="/signup"
                  onClick={() => {
                    trackEvent('Navbar SmallScreen Link Clicked', { link: 'Sign Up' });
                    toggleMenu();
                  }}
                >
                  Sign Up
                </NavLink>
              </Box>
            </StyledMenu>
          )}
          {!size.isSmallScreen && !isAuthenticated && auth.isLoaded && (
            <FlexContainer as="nav">
              <NavLink to="/install">Get the App</NavLink>
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <NavLink to="/login">Log In</NavLink>
              <Button type="link" to="/signup">
                Sign Up
              </Button>
            </FlexContainer>
          )}
          {!size.isSmallScreen && isAuthenticated && auth.isLoaded && !isInOnboardingFlow && (
            <TopNavIconWrapper>
              <Link
                to="/app/trips"
                getProps={isPartiallyActive}
                onClick={() => trackEvent('Navbar LoggedInUser Link Clicked', { link: 'Trips' })}
              >
                <FaCalendar data-tip="Trips" data-for="trips" />
                <ReactTooltip
                  id="trips"
                  place="bottom"
                  type="dark"
                  effect="solid"
                  className="tooltip customTooltip"
                  delayShow={500}
                  offset={{
                    bottom: 8,
                  }}
                />
              </Link>
              <Link
                to="/app/gear-closet"
                getProps={isPartiallyActive}
                onClick={() =>
                  trackEvent('Navbar LoggedInUser Link Clicked', { link: 'gear-closet' })
                }
              >
                <GearClosetIcon data-tip="Gear Closet" data-for="gearCloset" size={17} />
                <ReactTooltip
                  id="gearCloset"
                  place="bottom"
                  type="dark"
                  effect="solid"
                  className="tooltip customTooltip"
                  delayShow={500}
                  offset={{
                    bottom: 8,
                  }}
                />
              </Link>
              {/* TODO: when shopping list is ready 
              <Link
                to="/app/shopping-list"
                getProps={isPartiallyActive}
                onClick={() =>
                  trackEvent('Navbar LoggedInUser Link Clicked', { link: 'Shopping List' })
                }
              >
                <FaShoppingCart data-tip="Shopping list" data-for="shoppingList" />
                <ReactTooltip
                  id="shoppingList"
                  place="bottom"
                  type="dark"
                  effect="solid"
                  className="tooltip customTooltip"
                  delayShow={500}
                  offset={{
                    bottom: 8,
                  }}
                />
              </Link> */}
              {profile.isAdmin && (
                <Link to="/admin/gear-list" getProps={isPartiallyActive}>
                  <FaUserLock data-tip="Admin" data-for="admin" />
                  <ReactTooltip
                    id="admin"
                    place="bottom"
                    type="dark"
                    effect="solid"
                    className="tooltip customTooltip"
                    delayShow={500}
                    offset={{
                      bottom: 8,
                    }}
                  />
                </Link>
              )}
              {loggedInUser && loggedInUser.length > 0 && (
                <Link
                  to="/app/profile"
                  getProps={isPartiallyActive}
                  onClick={() =>
                    trackEvent('Navbar LoggedInUser Link Clicked', { link: 'Profile' })
                  }
                >
                  <Avatar
                    src={loggedInUser[0].photoURL as string}
                    size="xs"
                    gravatarEmail={loggedInUser[0].email as string}
                    data-tip="Profile"
                    data-for="profile"
                  />
                  <ReactTooltip
                    id="profile"
                    place="bottom"
                    type="dark"
                    effect="solid"
                    className="tooltip customTooltip"
                    delayShow={500}
                    offset={{
                      bottom: 8,
                    }}
                  />
                </Link>
              )}
            </TopNavIconWrapper>
          )}
        </FlexContainer>
      </PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
