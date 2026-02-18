/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-duplicates */
/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from 'react';

import Layout from './src/components/Layout';
import { COLORS, COLOR_MODE_KEY, INITIAL_COLOR_MODE_CSS_PROP } from './src/styles/color';

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
