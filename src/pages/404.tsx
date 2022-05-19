import { Box, Button, Heading, LoadingPage, PageContainer, Seo } from '@components';
import { RouteComponentProps } from '@reach/router';
import trackEvent from '@utils/trackEvent';
import React, { FunctionComponent, useEffect, useState } from 'react';

const NotFoundPage: FunctionComponent<RouteComponentProps> = () => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Add a timeout of 5 seconds for when the app is updating so the 404 page doesn't show immediately
    const timer = setTimeout(() => setShowLoading(false), 5000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (showLoading) {
    return <LoadingPage />;
  }
  return (
    <PageContainer withVerticalPadding>
      <Seo title="404: Not found" />

      <Box>
        <Heading>Sorry, something went wrong.</Heading>
        <p>
          We could not find the page you were looking for. Please try again or visit the home page.
        </p>
        <Button
          type="link"
          to="/"
          color="primary"
          onClick={() => trackEvent('404 Home Button Clicked')}
        >
          Home
        </Button>
      </Box>
    </PageContainer>
  );
};

export default NotFoundPage;
