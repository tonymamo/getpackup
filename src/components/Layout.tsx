import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import { Link } from 'gatsby';
import CookieConsent from 'react-cookie-consent';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Footer, Navbar, GlobalAlerts } from '@components';
import '@styles/webfonts.css';

import { quadrupleSpacer } from '@styles/size';
import { brandPrimary, black, white } from '@styles/color';
import CssReset from '@styles/cssReset';
import topo from '@images/topo.png';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const PageBody = styled.main`
  flex: 1;
  margin-top: ${quadrupleSpacer};
  background-image: url('${topo}');
  background-color: ${white};
  background-size: 500px;
`;

type LayoutProps = {
  hideFromCms?: boolean;
};

const Layout: FunctionComponent<LayoutProps> = (props) => {
  return (
    <>
      <CssReset />
      <IconContext.Provider value={{ style: { position: 'relative' } }}>
        <LayoutWrapper>
          {!props.hideFromCms && <Navbar />}
          <PageBody>{props.children}</PageBody>
          {!props.hideFromCms && <GlobalAlerts />}
          <Footer />
        </LayoutWrapper>
        <CookieConsent
          location="bottom"
          buttonText="Accept"
          cookieName="packup-gdpr-google-analytics"
          style={{
            backgroundColor: black,
          }}
          buttonStyle={{
            backgroundColor: brandPrimary,
            color: white,
          }}
        >
          This site uses cookies to enhance the user experience. Visit our{' '}
          <Link to="/privacy">Privacy page</Link> to learn more.
        </CookieConsent>
      </IconContext.Provider>
    </>
  );
};

export default Layout;
