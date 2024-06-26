import { TripMemberStatus, TripType } from '@common/trip';
import {
  Avatar,
  Badges,
  Box,
  Button,
  FlexContainer,
  Heading,
  HorizontalRule,
  NotificationDot,
  PageContainer,
} from '@components';
import GearClosetIcon from '@images/gearClosetIcon';
import yak from '@images/yak.svg';
import { useLocation } from '@reach/router';
import { RootState } from '@redux/ducks';
import { brandPrimary, brandSecondary, brandTertiary, white } from '@styles/color';
import { zIndexNavbar } from '@styles/layers';
import { baseSpacer, halfSpacer, quadrupleSpacer, quarterSpacer, tripleSpacer } from '@styles/size';
import { fontSizeBase, fontSizeH3, fontSizeSmall, headingsFontFamily } from '@styles/typography';
import { TabOptions } from '@utils/enums';
import scrollToPosition from '@utils/scrollToPosition';
import trackEvent from '@utils/trackEvent';
import useWindowSize from '@utils/useWindowSize';
import { Link, navigate } from 'gatsby';
import { Spin as Hamburger } from 'hamburger-react';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaCalendar, FaChevronLeft, FaShoppingCart, FaUserLock } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import styled from 'styled-components';

import { AvatarImageWrapper } from './Avatar';

type NavbarProps = {};

const StyledNavbar = styled.header`
  position: fixed;
  left: 0;
  right: 0;
  // background: var(--color-secondary);
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
    padding: 0 ${baseSpacer};
    height: ${quadrupleSpacer};
    color: ${white};
    border-top: ${quarterSpacer} solid transparent;
    border-bottom: ${quarterSpacer} solid transparent;
    position: relative;
    transition: all 0.2s ease-in-out;
  }

  & a > svg {
    flex-shrink: 0;
  }

  & a.active > svg {
    color: ${brandPrimary};
  }

  & a:hover,
  & a:focus,
  & a.active {
    border-bottom-color: ${brandPrimary};
  }

  & a:focus {
    outline: 1px dotted ${brandPrimary};
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
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);
  const { activePackingListTab, personalListScrollPosition, sharedListScrollPosition } =
    useSelector((state: RootState) => state.client);

  useFirestoreConnect([
    { collection: 'users', where: ['uid', '==', auth.uid || ''], storeAs: 'loggedInUser' },
  ]);

  const nonArchivedTrips: TripType[] =
    isLoaded(trips) && Array.isArray(trips) && trips && trips.length > 0
      ? trips.filter((trip: TripType) => trip.archived !== true)
      : [];

  const pendingTrips = nonArchivedTrips.filter(
    (trip) =>
      trip.tripMembers &&
      trip.tripMembers[auth.uid] &&
      trip.tripMembers[auth.uid].status === TripMemberStatus.Pending
  );

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
                {size.isSmallScreen && !isAuthenticated ? '' : <>packup</>}
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
                packup
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
                      if (personalListScrollPosition || sharedListScrollPosition) {
                        scrollToPosition(
                          activePackingListTab === TabOptions.Personal
                            ? personalListScrollPosition
                            : sharedListScrollPosition
                        );
                      }
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
          {!size.isSmallScreen && !isAuthenticated && auth.isLoaded && (
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
          {!size.isSmallScreen && isAuthenticated && auth.isLoaded && !isInOnboardingFlow && (
            <TopNavIconWrapper>
              <Link
                to="/app/trips"
                getProps={isPartiallyActive}
                onClick={() => trackEvent('Navbar LoggedInUser Link Clicked', { link: 'Trips' })}
              >
                <FaCalendar style={{ marginRight: halfSpacer }} /> Trips
                {pendingTrips.length > 0 && <NotificationDot top={halfSpacer} right="0" />}
              </Link>
              <Link
                to="/app/gear-closet"
                getProps={isPartiallyActive}
                onClick={() =>
                  trackEvent('Navbar LoggedInUser Link Clicked', { link: 'gear-closet' })
                }
              >
                <GearClosetIcon size={17} style={{ marginRight: halfSpacer }} /> Gear Closet
              </Link>

              {false ? ( // TODO
                <Link
                  to="/app/shopping-list"
                  getProps={isPartiallyActive}
                  onClick={() =>
                    trackEvent('Navbar LoggedInUser Link Clicked', { link: 'Shopping List' })
                  }
                >
                  <FaShoppingCart style={{ marginRight: halfSpacer }} /> Shopping List
                </Link>
              ) : null}

              {profile.isAdmin && (
                <Link to="/admin/gear-list" getProps={isPartiallyActive}>
                  <FaUserLock /> Admin
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
                    rightMargin
                  />{' '}
                  Profile
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
