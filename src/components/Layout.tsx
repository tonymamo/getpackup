import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import Modal from 'react-modal';
import 'typeface-open-sans';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ErrorBoundary, Footer, Navbar, GlobalAlerts } from '@components';
import '@styles/webfonts.css';
import { quadrupleSpacer } from '@styles/size';
import CssReset from '@styles/cssReset';
import UpploadTheme from '@styles/upploadTheme';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const PageBody = styled.main`
  flex: 1;
  margin-top: calc(${quadrupleSpacer} + env(safe-area-inset-top));
  padding-bottom: calc(${quadrupleSpacer} + env(safe-area-inset-bottom));
`;

type LayoutProps = {
  hideFromCms?: boolean;
};

Modal.setAppElement('#___gatsby');

const Layout: FunctionComponent<LayoutProps> = (props) => {
  return (
    <>
      <CssReset />
      <UpploadTheme />
      <IconContext.Provider value={{ style: { position: 'relative' } }}>
        <LayoutWrapper>
          {!props.hideFromCms && <Navbar />}
          <PageBody>
            <ErrorBoundary>{props.children}</ErrorBoundary>
          </PageBody>
          {!props.hideFromCms && <GlobalAlerts />}
          <Footer />
        </LayoutWrapper>
      </IconContext.Provider>
    </>
  );
};

export default Layout;
