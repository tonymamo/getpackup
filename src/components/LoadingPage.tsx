import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import { FlexContainer, Heading, PageContainer } from '@components';
import { brandPrimary } from '@styles/color';
import { octupleSpacer } from '@styles/size';
import React, { FunctionComponent } from 'react';
import Loader from 'react-loader-spinner';

const LoadingPage: FunctionComponent<{}> = () => (
  <PageContainer withVerticalPadding>
    <FlexContainer height="75vh" flexDirection="column">
      <Loader type="Rings" color={brandPrimary} height={octupleSpacer} width={octupleSpacer} />
      <Heading as="h6" uppercase>
        Loading...
      </Heading>
    </FlexContainer>
  </PageContainer>
);

export default LoadingPage;
