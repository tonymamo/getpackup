import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';

import { PageContainer, Button, Box, Seo, Heading } from '../components';

const NotFoundPage: FunctionComponent<RouteComponentProps> = () => (
  <PageContainer withVerticalPadding>
    <Seo title="404: Not found" />

    <Box>
      <Heading>Sorry, something went wrong.</Heading>
      <p>
        We could not find the page you were looking for. Please try again or visit the home page.
      </p>
      <Button type="link" to="/" color="primary">
        Home
      </Button>
    </Box>
  </PageContainer>
);

export default NotFoundPage;
