import React, { FunctionComponent } from 'react';
import Skeleton from 'react-loading-skeleton';
import { RouteComponentProps } from '@reach/router';

import { Box, PageContainer } from '@components';

const LoadingPage: FunctionComponent<RouteComponentProps> = () => (
  <PageContainer withVerticalPadding>
    <Skeleton width={200} height={40} />
    <br />
    <br />
    <Box>
      <Skeleton count={20} />
    </Box>
  </PageContainer>
);

export default LoadingPage;
