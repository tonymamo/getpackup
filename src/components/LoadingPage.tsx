import React, { FunctionComponent } from 'react';
import Skeleton from 'react-loading-skeleton';
import { RouteComponentProps } from '@reach/router';

import Box from './Box';
import PageContainer from './PageContainer';

const LoadingPage: FunctionComponent<RouteComponentProps> = () => (
  <PageContainer>
    <Skeleton width={200} height={40} />
    <br />
    <br />
    <Box>
      <Skeleton count={20} />
    </Box>
  </PageContainer>
);

export default LoadingPage;
