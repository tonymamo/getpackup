/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import differenceInDays from 'date-fns/differenceInDays';

import { Modal, Heading, Button } from '@components';

const AddToHomeScreenModal = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setOpened] = useState(false);

  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  const isInStandaloneMode = () => 'standalone' in window.navigator && window.navigator.standalone;

  const LOCAL_STORAGE_KEY = 'packup_pwa_popup_display';
  const NB_DAYS_EXPIRE = 30; // only ask once every 30 days so we dont annoy
  const isDevelopment = process.env.NODE_ENV === 'development';

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
      if (isDevelopment) {
        console.log('isIOS: ', isIos());
        console.log('isInStandaloneMode: ', isInStandaloneMode());
        console.log('checkLastPwaDisplay: ', checkLastPwaDisplay());
      }
      if (isIos() && !isInStandaloneMode() && checkLastPwaDisplay()) {
        setOpened(true);
      }
    }, 5000);
    return () => {
      if (t) clearTimeout(t);
    };
  }, []);

  if (!isLoaded) return null;

  return isOpen ? (
    <Modal isOpen={isOpen} toggleModal={() => saveLastPwaDisplay()}>
      <Heading altStyle>Add To Home Screen</Heading>
      <p>Want to add this app to your home screen so you can get to it easier next time?</p>
      <Button type="link" to="/install" color="primary" block>
        Show me how!
      </Button>
      <Button type="button" color="text" block onClick={() => saveLastPwaDisplay()}>
        Nah, I&apos;m good
      </Button>
    </Modal>
  ) : null;
};

export default AddToHomeScreenModal;
