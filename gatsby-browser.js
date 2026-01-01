/* eslint-disable react/jsx-filename-extension */
import React from 'react';

import Layout from './src/components/Layout';

export { default as wrapRootElement } from './src/redux/ReduxWrapper';

// wrapping with React Fragment here so we can use hooks in Layout
export const wrapPageElement = ({ element }) => {
  return <Layout>{element}</Layout>;
};
