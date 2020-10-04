import React, { useEffect, useRef, useState, FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link, navigate } from 'gatsby';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import { Squash as Hamburger } from 'hamburger-react';
import { FaCalendar, FaSignOutAlt, FaUser } from 'react-icons/fa';

import PageContainer from './PageContainer';
import FlexContainer from './FlexContainer';
import Heading from './Heading';
import Avatar from './Avatar';
import Button from './Button';
import Box from './Box';
import HorizontalRule from './HorizontalRule';

import { brandSecondary, brandTertiary, white, brandPrimary } from '../styles/color';
import { halfSpacer, quadrupleSpacer, tripleSpacer } from '../styles/size';
import { headingsFontFamily, fontSizeSmall } from '../styles/typography';
import { addAlert } from '../redux/ducks/globalAlerts';
import { RootState } from '../redux/ducks';

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
  transform: scale(${(props: { menuIsOpen: boolean }) => (props.menuIsOpen ? 1 : 0)});
  top: ${tripleSpacer};
  right: 0;
  z-index: 10;
  transition: all 200ms linear;
  width: 75vw;
  max-width: 300px;
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
  const menuDropdown = useRef<HTMLDivElement>(null);
  const hamburgerButton = useRef<HTMLDivElement>(null);

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

  const loggedInUser = auth && auth.isLoaded && !auth.isEmpty;

  return (
    <StyledNavbar role="navigation" aria-label="main-navigation">
      <PageContainer>
        <FlexContainer
          justifyContent="space-between"
          alignItems="center"
          style={{ position: 'relative' }}
        >
          <Heading noMargin>
            <Link to={loggedInUser ? '/app/trips' : '/'}>packup</Link>
          </Heading>
          {loggedInUser && (
            <StyledMenuToggle ref={hamburgerButton}>
              <Hamburger
                color={white}
                toggled={menuIsOpen}
                toggle={() => setMenuIsOpen(!menuIsOpen)}
              />
            </StyledMenuToggle>
          )}
          {loggedInUser && (
            <StyledMenu id="navMenu" menuIsOpen={menuIsOpen} ref={menuDropdown}>
              <Box>
                <FlexContainer flexDirection="column">
                  <Avatar src={auth.photoURL as string} gravatarEmail={auth.email as string} />
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
                <NavLink to="/app/profile" onClick={() => toggleMenu()}>
                  <FaUser /> Profile
                </NavLink>
                <HorizontalRule compact />
                <NavLink to="/" onClick={logout}>
                  <FaSignOutAlt /> Log Out
                </NavLink>
              </Box>
            </StyledMenu>
          )}
          {!loggedInUser && (
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
        </FlexContainer>
      </PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
