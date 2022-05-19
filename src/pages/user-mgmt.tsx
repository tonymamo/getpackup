import { Box, Column, PageContainer, Row, Seo } from '@components';
import { RouteComponentProps } from '@reach/router';
import ResetPassword from '@views/ResetPassword';
import VerifyEmail from '@views/VerifyEmail';
import { navigate } from 'gatsby';
import { parse } from 'query-string';
import React, { FunctionComponent } from 'react';

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

const Error = () => {
  if (typeof window !== 'undefined') {
    navigate('/404');
  }
  return null;
};

export default UserManagement;
