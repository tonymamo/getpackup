import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import 'typeface-open-sans';
import 'bootstrap/dist/css/bootstrap.min.css';

import Footer from './Footer';
import Navbar from './Navbar';
import GlobalAlerts from './GlobalAlerts';
import '../styles/webfonts.css';

import { quadrupleSpacer } from '../styles/size';
import { white } from '../styles/color';
import CssReset from '../styles/cssReset';
import topo from '../images/topo.png';

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
  padding-top: env(safe-area-inset-top);
  background-image: url('${topo}');
  background-color: ${white};
  background-size: 500px;
`;

type LayoutProps = {};

const Layout: FunctionComponent<LayoutProps> = (props) => {
  return (
    <>
      <CssReset />
      <IconContext.Provider value={{ style: { position: 'relative' } }}>
        <LayoutWrapper>
          <Navbar />
          <PageBody>{props.children}</PageBody>
          <GlobalAlerts />
          <Footer />
        </LayoutWrapper>
      </IconContext.Provider>
    </>
  );
};

export default Layout;
