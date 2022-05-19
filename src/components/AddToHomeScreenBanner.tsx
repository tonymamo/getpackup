import { Button, FlexContainer } from '@components';
import logo from '@images/maskable_icon.png';
import { useLocation } from '@reach/router';
import { RootState } from '@redux/ducks';
import { white } from '@styles/color';
import { zIndexModal } from '@styles/layers';
import { doubleSpacer, halfSpacer } from '@styles/size';
import differenceInDays from 'date-fns/differenceInDays';
/* eslint-disable no-console */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const AddToHomeScreenWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  background-color: ${white};
  z-index: ${zIndexModal};
  padding: ${halfSpacer};
`;

const StyledImage = styled.img`
  width: ${doubleSpacer};
  height: ${doubleSpacer};
  margin-right: ${halfSpacer};
  border-radius: ${halfSpacer};
`;

const AddToHomeScreenBanner: FunctionComponent<{}> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const trips = useSelector((state: RootState) => state.firestore.ordered.trips);
  const isAuthenticated = auth && !auth.isEmpty;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setOpened] = useState(false);

  const location = useLocation();

  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  const isInStandaloneMode = () => 'standalone' in window.navigator && window.navigator.standalone;

  const getPWADisplayMode = () => {
    // https://web.dev/customize-install/#detect-launch-type
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (document.referrer.startsWith('android-app://')) {
      return 'twa';
    }
    if (navigator.standalone || isStandalone) {
      return 'standalone';
    }
    return 'browser';
  };

  const LOCAL_STORAGE_KEY = 'packup_pwa_popup_display';
  const NB_DAYS_EXPIRE = 30; // only ask once every 30 days so we dont annoy

  const checkLastPwaDisplay = () => {
    const lastDisplayTimestamp = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!lastDisplayTimestamp) return true;
    return differenceInDays(new Date(lastDisplayTimestamp), new Date()) > NB_DAYS_EXPIRE;
  };
  const saveLastPwaDisplay = () => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, String(new Date()));
    setOpened(false);
  };

  useEffect(() => {
    setIsLoaded(true);

    const t = setTimeout(() => {
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('isIOS: ', isIos());
      //   console.log('isInStandaloneMode: ', isInStandaloneMode());
      //   console.log('checkLastPwaDisplay: ', checkLastPwaDisplay());
      // }
      if (
        isAuthenticated &&
        trips &&
        trips.length > 0 &&
        (location.pathname === '/app/trips' || location.pathname === '/app/trips/') &&
        isIos() &&
        !isInStandaloneMode() &&
        checkLastPwaDisplay() &&
        getPWADisplayMode() === 'browser'
      ) {
        setOpened(true);
      }
    }, 5000);
    return () => {
      if (t) clearTimeout(t);
    };
  }, []);

  if (!isLoaded) return null;

  return isOpen ? (
    <AddToHomeScreenWrapper>
      <FlexContainer justifyContent="space-between">
        <FlexContainer>
          <StyledImage src={logo} alt="" />
          <span style={{ lineHeight: 1 }}>
            <strong>packup</strong>
            <br />
            <small>Adventure made easy.</small>
          </span>
        </FlexContainer>
        <FlexContainer>
          <Button
            type="link"
            to="/install"
            onClick={() => saveLastPwaDisplay()}
            size="small"
            color="success"
            rightSpacer
          >
            Install
          </Button>
          <FaTimes onClick={() => saveLastPwaDisplay()} />
        </FlexContainer>
      </FlexContainer>
    </AddToHomeScreenWrapper>
  ) : null;
};

export default AddToHomeScreenBanner;
