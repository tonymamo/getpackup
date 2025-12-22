/* eslint-disable import/no-duplicates */
/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// You can delete this file if you're not using it
import React from 'react';

import Layout from './src/components/Layout';
import { onWorkerUpdateReady } from './src/redux/ReduxWrapper';

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
  onWorkerUpdateReady();
  // Automatically reload the page after a short delay to ensure users get the latest version
  // This prevents stale cache issues where old page-data.json files cause JSON parsing errors
  setTimeout(() => {
    window.location.reload();
  }, 3000); // Give the user 3 seconds to see the modal before reloading
};
