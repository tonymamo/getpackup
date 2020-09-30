import React, { FunctionComponent } from 'react';
import Skeleton from 'react-loading-skeleton';
import { RouteComponentProps } from '@reach/router';

import Box from './Box';

const LoadingPage: FunctionComponent<RouteComponentProps> = () => (
  <>
    <Skeleton width={200} height={40} />
    <br />
    <br />
    <Box>
      <Skeleton count={20} />
    </Box>
  </>
);

export default LoadingPage;
