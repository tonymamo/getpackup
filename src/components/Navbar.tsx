import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link, navigate } from 'gatsby';
import firebase from 'gatsby-plugin-firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

import PageContainer from './PageContainer';
import FlexContainer from './FlexContainer';
import Heading from './Heading';
import Avatar from './Avatar';

import { brandSecondary, white } from '../styles/color';
import { halfSpacer, quadrupleSpacer } from '../styles/size';
import { headingsFontFamily, fontSizeSmall } from '../styles/typography';

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
  const [user] = useAuthState(firebase.auth());
  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (user) {
    user.providerData.forEach((profile) => {
      console.log(`Sign-in provider: ${profile?.providerId}`);
      console.log(`  Provider-specific UID: ${profile?.uid}`);
      console.log(`  Name: ${profile?.displayName}`);
      console.log(`  Email: ${profile?.email}`);
      console.log(`  Photo URL: ${profile?.photoURL}`);
    });
  }
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
            {user && (
              <>
                <div style={{ display: 'inline-flex' }}>
                  <Avatar src={user.photoURL as string} />
                </div>
                <NavLink to="/" onClick={logout}>
                  Log Out
                </NavLink>
              </>
            )}
          </nav>
        </FlexContainer>
      </PageContainer>
    </StyledNavbar>
  );
};

export default Navbar;
