/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

export { default as wrapRootElement } from './src/redux/ReduxWrapper';
export { default as wrapPageElement } from './src/components/Layout';
