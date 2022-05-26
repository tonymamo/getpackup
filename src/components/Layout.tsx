import '@styles/bootstrapCarousel.css';

import { ErrorBoundary, GlobalAlerts, Navbar } from '@components';
import loadable from '@loadable/component';
import { black, brandPrimary, brandSecondary, white } from '@styles/color';
import CssReset from '@styles/cssReset';
import { quadrupleSpacer } from '@styles/size';
import { Link } from 'gatsby';
import React, { FunctionComponent, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { IconContext } from 'react-icons';
import Modal from 'react-modal';
import styled from 'styled-components';

import UpdateConfirmModal from './UpdateConfirmModal';

const Footer = loadable(() => import('@components/Footer'), {
  fallback: <footer style={{ backgroundColor: brandSecondary, height: '20vh' }} />,
});
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
      <div style={{ display: 'none' }}>{process.env.COMMIT_REF || ''}</div>
      <CssReset />
      <UpploadTheme />
      <IconContext.Provider value={{ style: { position: 'relative' } }}>
        <LayoutWrapper>
          {!props.hideFromCms && <AddToHomeScreenBanner />}
          {!props.hideFromCms && <Navbar />}
          <PageBody>
            <ErrorBoundary>{props.children}</ErrorBoundary>
          </PageBody>
          {!props.hideFromCms && <GlobalAlerts />}
          {!props.hideFromCms && <Footer />}
          {!props.hideFromCms && <UpdateConfirmModal />}
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
