import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link, navigate } from 'gatsby';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';

import PageContainer from './PageContainer';
import FlexContainer from './FlexContainer';
import Heading from './Heading';
import Avatar from './Avatar';
import Button from './Button';

import { brandSecondary, white } from '../styles/color';
import { halfSpacer, quadrupleSpacer } from '../styles/size';
import { headingsFontFamily, fontSizeSmall } from '../styles/typography';
import { addAlert } from '../redux/ducks/globalAlerts';
import { RootState } from '../redux/ducks';

type NavbarProps = {};

const StyledNavbar = styled.header`
  position: fixed;
  left: 0;
  right: 0;
  background: ${brandSecondary};
  color: ${white};
  min-height: ${quadrupleSpacer};
  padding-top: env(safe-area-inset-top);
  line-height: ${quadrupleSpacer};
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

const Navbar: FunctionComponent<NavbarProps> = () => {
  const firebase = useFirebase();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(
      addAlert({
        type: 'success',
        message: 'You have successfully logged out. See ya next time!',
      })
    );
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
        <FlexContainer justifyContent="space-between" alignItems="center">
          <Heading noMargin>
            <Link to={loggedInUser ? '/app/trips' : '/'}>packup</Link>
          </Heading>
          <nav>
            {loggedInUser && (
              <FlexContainer alignItems="center">
                <NavLink to="/app/trips">Trips</NavLink>
                <NavLink to="/app/profile">
                  <span
                    style={{
                      display: 'inline-flex',
                      verticalAlign: 'text-bottom',
                      marginRight: halfSpacer,
                    }}
                  >
                    <Avatar src={auth.photoURL as string} gravatarEmail={auth.email as string} />
                  </span>
                  Profile
                </NavLink>
                <NavLink to="/" onClick={logout}>
                  Log Out
                </NavLink>
              </FlexContainer>
            )}
            {!loggedInUser && (
              <>
                <NavLink to="/blog">Blog</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                <NavLink to="/login">Login</NavLink>
                <Button type="link" to="/signup">
                  Sign Up
                </Button>
              </>
            )}
          </nav>
        </FlexContainer>
      </PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
