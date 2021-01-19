/* eslint-disable import/no-duplicates */
/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React from 'react';
import 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import Layout from './src/components/Layout';

export { default as wrapRootElement } from './src/redux/ReduxWrapper';

// wrapping with React Fragment here so we can use hooks in Layout
export const wrapPageElement = ({ element }) => {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <>
      <Layout>{element}</Layout>
    </>
  );
};

export const onServiceWorkerUpdateReady = () => {
  // eslint-disable-next-line no-alert
  const answer = window.confirm(
    `This application has been updated. Reload to display the latest version?`
  );
  if (answer === true) {
    window.location.reload();
  }
};
