import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import 'typeface-open-sans';

import Footer from './Footer';
import Navbar from './Navbar';
import '../styles/webfonts.css';

import { quadrupleSpacer } from '../styles/size';
import CssReset from '../styles/cssReset';
import topo from '../images/topo.png';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const PageBody = styled.div`
  flex: 1;
  margin-top: ${quadrupleSpacer};
  background: url('${(props: { bgImg: string }) => props.bgImg}');
  background-size: 500px;
`;

type LayoutProps = { element: any };

const Layout: FunctionComponent<LayoutProps> = ({ element }) => (
  <>
    <CssReset />
    <IconContext.Provider value={{ style: { position: 'relative' } }}>
      <LayoutWrapper>
        <Navbar />
        <PageBody bgImg={topo}>{element}</PageBody>
        <Footer />
      </LayoutWrapper>
    </IconContext.Provider>
  </>
);

export default Layout;
