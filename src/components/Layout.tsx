import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import Modal from 'react-modal';
import { Link } from 'gatsby';
import CookieConsent from 'react-cookie-consent';
import 'bootstrap/dist/css/bootstrap.min.css';
import loadable from '@loadable/component';

import { ErrorBoundary, Navbar, GlobalAlerts } from '@components';
import { quadrupleSpacer } from '@styles/size';
import { brandPrimary, black, white } from '@styles/color';

const Footer = loadable(() => import('@components/Footer'));
const CssReset = loadable(() => import('@styles/cssReset'));
const UpploadTheme = loadable(() => import('@styles/upploadTheme'));
const AddToHomeScreenBanner = loadable(() => import('./AddToHomeScreenBanner'));

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const PageBody = styled.main`
  flex: 1;
  padding-top: calc(${quadrupleSpacer} + env(safe-area-inset-top));
  padding-bottom: calc(${quadrupleSpacer} + env(safe-area-inset-bottom));
`;

type LayoutProps = {
  hideFromCms?: boolean;
};

const Layout: FunctionComponent<LayoutProps> = (props) => {
  useEffect(() => {
    if (!props.hideFromCms) {
      Modal.setAppElement('#___gatsby');
    }
  }, []);
  return (
    <>
      <CssReset />
      <UpploadTheme />
      <IconContext.Provider value={{ style: { position: 'relative' } }}>
        <LayoutWrapper>
          <AddToHomeScreenBanner />
          {!props.hideFromCms && <Navbar />}
          <PageBody>
            <ErrorBoundary>{props.children}</ErrorBoundary>
          </PageBody>
          {!props.hideFromCms && <GlobalAlerts />}
          {!props.hideFromCms && <Footer />}
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
