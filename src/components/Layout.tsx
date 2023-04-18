import 'animate.css';
import '@styles/bootstrapCarousel.css';

import { ErrorBoundary, GlobalAlerts, Navbar } from '@components';
import loadable from '@loadable/component';
import { useLocation } from '@reach/router';
import { brandSecondary, brandSuccess, white } from '@styles/color';
import CssReset from '@styles/cssReset';
import { borderRadius, quadrupleSpacer, quarterSpacer, threeQuarterSpacer } from '@styles/size';
import { ThemeProvider } from '@utils/ThemeContext';
import { Link } from 'gatsby';
import React, { FunctionComponent, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { IconContext } from 'react-icons';
import Modal from 'react-modal';
import styled from 'styled-components';

const Footer = loadable(() => import('@components/Footer'), {
  fallback: <footer style={{ backgroundColor: brandSecondary, height: '20vh' }} />,
});
const UpploadTheme = loadable(() => import('@styles/upploadTheme'));

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const PageBody = styled.main<{ isHomePage: boolean }>`
  flex: 1;
  padding-top: ${(props) =>
    props.isHomePage ? '0' : `calc(${quadrupleSpacer} + env(safe-area-inset-top))`};
  padding-bottom: ${(props) =>
    props.isHomePage ? '0' : `calc(${quadrupleSpacer} + env(safe-area-inset-bottom))`};
`;

type LayoutProps = {
  hideFromCms?: boolean;
};

const Layout: FunctionComponent<LayoutProps> = (props) => {
  const location = useLocation();

  useEffect(() => {
    if (!props.hideFromCms) {
      Modal.setAppElement('#___gatsby');
    }
  }, []);
  return (
    <>
      <ThemeProvider>
        <CssReset />
        <UpploadTheme />
        <IconContext.Provider value={{ style: { position: 'relative' } }}>
          <LayoutWrapper>
            {!props.hideFromCms && <Navbar />}
            <PageBody isHomePage={location.pathname === '/'}>
              <ErrorBoundary>{props.children}</ErrorBoundary>
            </PageBody>
            {!props.hideFromCms && <GlobalAlerts />}
            {!props.hideFromCms && location.pathname !== '/' && <Footer />}
          </LayoutWrapper>
          <CookieConsent
            location="bottom"
            buttonText="Accept"
            cookieName="packup-gdpr-google-analytics"
            style={{
              backgroundColor: brandSecondary,
            }}
            buttonStyle={{
              backgroundColor: brandSuccess,
              color: white,
              fontSize: '80%',
              borderRadius,
              fontWeight: 'bold',
              padding: `${quarterSpacer} ${threeQuarterSpacer}`,
            }}
          >
            <small>
              This site uses cookies to enhance the user experience. Visit our{' '}
              <Link to="/privacy" style={{ color: white, textDecoration: 'underline' }}>
                Privacy page
              </Link>{' '}
              to learn more.
            </small>
          </CookieConsent>
        </IconContext.Provider>
      </ThemeProvider>
    </>
  );
};

export default Layout;
