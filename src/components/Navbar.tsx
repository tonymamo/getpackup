import React, { useEffect, useRef, useState, FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link, navigate } from 'gatsby';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import { Spin as Hamburger } from 'hamburger-react';
import { FaCalendar, FaCog, FaSearch, FaShoppingCart, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

import PageContainer from './PageContainer';
import FlexContainer from './FlexContainer';
import Heading from './Heading';
import Avatar from './Avatar';
import Button from './Button';
import Box from './Box';
import HorizontalRule from './HorizontalRule';

import { brandSecondary, brandTertiary, white, brandPrimary } from '../styles/color';
import { halfSpacer, quadrupleSpacer, screenSizes, tripleSpacer } from '../styles/size';
import { headingsFontFamily, fontSizeSmall, fontSizeBase } from '../styles/typography';
import { addAlert } from '../redux/ducks/globalAlerts';
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
    flex: 1;
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

const Navbar: FunctionComponent<NavbarProps> = () => {
  const firebase = useFirebase();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const dispatch = useDispatch();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const onHelmetChange = ({ title }: { title: string }) => {
    if (title !== undefined) {
      setPageTitle(title.replace(' | Packup: Adventure made easy.', ''));
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

  const logout = () => {
    setMenuIsOpen(false);
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
  };

  const truncatedPageTitle = () =>
    pageTitle.length > 25 ? `${pageTitle.substring(0, 25)}...` : pageTitle;

  const loggedInUser = auth && auth.isLoaded && !auth.isEmpty;

  return (
    <StyledNavbar role="navigation" aria-label="main-navigation" loggedInUser={loggedInUser}>
      <Helmet onChangeClientState={onHelmetChange} />
      <PageContainer>
        <FlexContainer justifyContent="space-between" alignItems="center">
          <Heading noMargin altStyle={loggedInUser}>
            {loggedInUser ? (
              <>
                <img src={yak} alt="" width={tripleSpacer} /> {truncatedPageTitle()}
              </>
            ) : (
              <Link to={loggedInUser ? '/app/trips' : '/'}>
                <img src={yak} alt="" width={tripleSpacer} /> packup
              </Link>
            )}
          </Heading>
          {isSmallScreen && (
            <StyledMenuToggle ref={hamburgerButton}>
              <Hamburger
                color={white}
                toggled={menuIsOpen}
                toggle={() => setMenuIsOpen(!menuIsOpen)}
              />
            </StyledMenuToggle>
          )}

          {isSmallScreen && (
            <StyledMenu id="navMenu" menuIsOpen={menuIsOpen} ref={menuDropdown}>
              <Box>
                {loggedInUser && (
                  <>
                    <FlexContainer flexDirection="column">
                      <Avatar
                        src={auth.photoURL as string}
                        gravatarEmail={auth.email as string}
                        size="md"
                      />
                      <small>{auth.displayName}</small>
                      <small>
                        <strong>{auth.email}</strong>
                      </small>
                    </FlexContainer>
                    <HorizontalRule compact />
                    <NavLink to="/app/trips" onClick={() => toggleMenu()}>
                      <FaCalendar /> Trips
                    </NavLink>
                    <HorizontalRule compact />
                    <NavLink to="/app/trips" onClick={() => toggleMenu()}>
                      <FaSearch /> Search
                    </NavLink>
                    <HorizontalRule compact />
                    <NavLink to="/app/trips" onClick={() => toggleMenu()}>
                      <FaShoppingCart /> Shopping List
                    </NavLink>
                    <HorizontalRule compact />
                    <NavLink to="/app/profile" onClick={() => toggleMenu()}>
                      <FaUser /> Profile
                    </NavLink>
                    <HorizontalRule compact />
                    <NavLink to="/app/trips" onClick={() => toggleMenu()}>
                      <FaCog /> Settings
                    </NavLink>
                    <HorizontalRule compact />
                    <NavLink to="/" onClick={logout}>
                      <FaSignOutAlt /> Log Out
                    </NavLink>
                  </>
                )}
                {!loggedInUser && (
                  <>
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
                  </>
                )}
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
            <FlexContainer as="nav">
              <NavLink to="/app/trips">
                <FaCalendar /> Trips
              </NavLink>
              <NavLink to="/app/profile">
                <FaUser /> Profile
              </NavLink>
              <NavLink to="/" onClick={logout}>
                <FaSignOutAlt /> Log Out
              </NavLink>
            </FlexContainer>
          )}
        </FlexContainer>
      </PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
