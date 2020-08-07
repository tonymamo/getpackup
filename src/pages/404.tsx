import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import { PageContainer, Button, FlexContainer, Seo } from '../components';

const NotFoundPage: FunctionComponent<RouteComponentProps> = () => (
  <PageContainer>
    <Seo title="404: Not found" />

    <FlexContainer>
      <p>
        We could not find the page you were looking for. Please try again or visit the home page.
      </p>
      <Button type="link" to="/" color="primary">
        Home
      </Button>
    </FlexContainer>
  </PageContainer>
);

export default NotFoundPage;
