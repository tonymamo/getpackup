import React, { Component } from 'react';
import * as Sentry from '@sentry/gatsby';

import { Row, Column, Button, Box, Heading, PageContainer } from '.';

type Props = {
  children: any;
};

// eslint-disable-next-line react/prefer-stateless-function
class ErrorBoundary extends Component<Props, {}> {
  render() {
    return (
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack, resetError }) => (
          <PageContainer>
            <Row>
              <Column md={6} mdOffset={3}>
                <Box>
                  <Heading as="h2">There was an error in loading this page.</Heading>
                  <p>
                    An unhandled error has occurred. If this continues to occur, please contact:{' '}
                    <a href="mailto:hello@getpackup.com">hello@getpackup.com</a>.
                  </p>
                  <p>
                    <Button type="button" rightspacer onClick={() => resetError()}>
                      Reset
                    </Button>

                    <a href="/">Go to Home</a>
                  </p>
                  <details>
                    <summary>Click for error details</summary>
                    <code>{error.toString()}</code>
                    <code>{componentStack}</code>
                  </details>
                </Box>
              </Column>
            </Row>
          </PageContainer>
        )}
      >
        {this.props.children}
      </Sentry.ErrorBoundary>
    );
  }
}

export default ErrorBoundary;
