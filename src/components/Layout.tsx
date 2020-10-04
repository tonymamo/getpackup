import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import 'typeface-open-sans';
import 'bootstrap/dist/css/bootstrap.min.css';

import Footer from './Footer';
import Navbar from './Navbar';
import GlobalAlerts from './GlobalAlerts';
import ErrorBoundary from './ErrorBoundary';
import '../styles/webfonts.css';

import { quadrupleSpacer } from '../styles/size';
import CssReset from '../styles/cssReset';

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
`;

type LayoutProps = {};

const Layout: FunctionComponent<LayoutProps> = (props) => {
  return (
    <>
      <CssReset />
      <IconContext.Provider value={{ style: { position: 'relative' } }}>
        <LayoutWrapper>
          <Navbar />
          <PageBody>
            <ErrorBoundary>{props.children}</ErrorBoundary>
          </PageBody>
          <GlobalAlerts />
          <Footer />
        </LayoutWrapper>
      </IconContext.Provider>
    </>
  );
};

export default Layout;
