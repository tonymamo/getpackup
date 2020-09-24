import React, { FunctionComponent } from 'react';

import { PageContainer, Button, Box, Seo, Heading } from '../components';

const EmailVerified: FunctionComponent<{}> = () => (
  <PageContainer withVerticalPadding>
    <Seo title="Email Verified" />

    <Box>
      <Heading>You&apos;re all set!</Heading>
      <p>Thanks for verifying your email. You can now login.</p>
      <Button type="link" to="/login" color="primary">
        Login
      </Button>
    </Box>
  </PageContainer>
);

export default EmailVerified;
