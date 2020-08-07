import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import 'typeface-lato';

import Footer from './Footer';
import Navbar from './Navbar';

import { baseSpacer, doubleSpacer, breakpoints } from '../styles/size';
import CssReset from '../styles/cssReset';
import bgImg from '../images/Mountains_Day.jpg';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${bgImg});
`;

const PageBody = styled.div`
  flex: 1;
  padding: ${baseSpacer} 0;
  @media only screen and (min-width: ${breakpoints.sm}) {
    padding: ${doubleSpacer} 0;
  }
`;

type LayoutProps = { element: any };

const Layout: FunctionComponent<LayoutProps> = ({ element }) => (
  <>
    <CssReset />
    <IconContext.Provider value={{ style: { position: 'relative' } }}>
      <LayoutWrapper>
        <Navbar />
        <PageBody>{element}</PageBody>
        <Footer />
      </LayoutWrapper>
    </IconContext.Provider>
  </>
);

export default Layout;
