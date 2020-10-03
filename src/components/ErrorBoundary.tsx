import React, { Component } from 'react';

import { Row, Column, Button, Box, Heading, PageContainer } from '.';

type Props = {
  children: any;
};

type State = {
  error: string;
  errorInfo: {
    componentStack: string;
  };
  hasError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: '',
      errorInfo: {
        componentStack: '',
      },
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: string) {
    return { hasError: true, error };
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (prevState.hasError) {
      this.resetErrorState();
    }
  }

  componentDidCatch(
    error: Error,
    errorInfo: {
      componentStack: string;
    }
  ) {
    // eslint-disable-next-line no-console
    console.log({ error, errorInfo });
    this.setState({ errorInfo });
  }

  resetErrorState = () => this.setState({ hasError: false });

  render() {
    const { error, hasError, errorInfo } = this.state;
    if (hasError) {
      return (
        <PageContainer withVerticalPadding>
          <Row>
            <Column md={6} mdOffset={3}>
              <Box>
                <Heading as="h2">There was an error in loading this page.</Heading>
                <p>
                  An unhandled error has occurred. If this continues to occur, please contact
                  hello@getpackup.com.
                </p>
                <p>
                  {typeof window !== 'undefined' && (
                    <Button
                      type="button"
                      rightSpacer
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      Reload this page
                    </Button>
                  )}

                  <a href="/">Go to Home</a>
                </p>
                <details>
                  <summary>Click for error details</summary>
                  <code>{errorInfo && errorInfo.componentStack.toString()}</code>
                  {error && <code>{error}</code>}
                </details>
              </Box>
            </Column>
          </Row>
        </PageContainer>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
