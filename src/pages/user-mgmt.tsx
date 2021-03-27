import React, { FunctionComponent } from 'react';
import { parse } from 'query-string';
import { RouteComponentProps } from '@reach/router';
import { navigate } from 'gatsby';

import { Row, Box, Column, PageContainer, Seo, LoadingSpinner } from '@components';
import ResetPassword from '@views/ResetPassword';
import useVerify from '@hooks/useVerify';
import { baseSpacer } from '@styles/size';

type UserManagementProps = {
  location: {
    state: {
      pathname: string;
    };
  };
} & RouteComponentProps;

type validMode = 'resetPassword' | 'verifyEmail';

const isValidMode = (mode: unknown): mode is validMode =>
  typeof mode === 'string' && ['resetPassword', 'verifyEmail'].includes(mode);

const isValidCode = (code: unknown): code is string => typeof code === 'string';

export const UserManagement: FunctionComponent<UserManagementProps> = ({ location }) => {
  const { mode, oobCode: actionCode } = parse(location.search);

  return (
    <>
      <PageContainer withVerticalPadding>
        <Seo title="User Management" />
        <Row>
          <Column md={8} mdOffset={2}>
            <Box>
              {mode === 'resetPassword' && isValidCode(actionCode) ? (
                <ResetPassword actionCode={actionCode} />
              ) : null}
              {mode === 'verifyEmail' && isValidCode(actionCode) ? (
                <VerifyEmail actionCode={actionCode} />
              ) : null}
              {!isValidMode(mode) || !isValidCode(actionCode) ? <Error /> : null}
            </Box>
          </Column>
        </Row>
      </PageContainer>
    </>
  );
};

type VerifyEmailProps = { actionCode: string };

const VerifyEmail = ({ actionCode }: VerifyEmailProps) => {
  // useVerify(isValidCode(actionCode) ? actionCode : undefined);

  return (
    <>
      <LoadingSpinner theme="dark" style={{ display: 'inline-block', marginRight: baseSpacer }} />
      Verifying your email address
    </>
  );
};

const Error = () => {
  navigate('/404');
  return null;
};

export default UserManagement;
