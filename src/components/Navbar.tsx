import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link, navigate } from 'gatsby';
import firebase from 'gatsby-plugin-firebase';
import { useDispatch } from 'react-redux';

import { PageContainer, FlexContainer, Heading, Avatar, Button } from '@components';

import { brandSecondary, white } from '@styles/color';
import { halfSpacer, quadrupleSpacer } from '@styles/size';
import { fontSizeSmall, headingsFontFamily } from '@styles/typography';
import useAuthState from '@utils/useFirebaseAuth';
import { addAlert } from '@redux/ducks/globalAlerts';

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
  const [user, loading] = useAuthState(firebase);
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

  // if (user) {
  //   user.providerData.forEach((profile) => {
  //     console.log(`Sign-in provider: ${profile?.providerId}`);
  //     console.log(`  Provider-specific UID: ${profile?.uid}`);
  //     console.log(`  Name: ${profile?.displayName}`);
  //     console.log(`  Email: ${profile?.email}`);
  //     console.log(`  Photo URL: ${profile?.photoURL}`);
  //   });
  // }
  return (
    <StyledNavbar role="navigation" aria-label="main-navigation">
      <PageContainer>
        <FlexContainer justifyContent="space-between">
          <Heading noMargin>
            <Link to="/">packup</Link>
          </Heading>
          <nav>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            {false &&
            user &&
            !loading && ( // TODO
                <>
                  <Link to="/app/profile" style={{ display: 'inline-flex' }}>
                    <Avatar src={user.photoURL as string} gravatarEmail={user.email as string} />
                  </Link>
                  <NavLink to="/" onClick={logout}>
                    Log Out
                  </NavLink>
                </>
              )}
            {false &&
            !user &&
            !loading && ( // TODO
                <>
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
