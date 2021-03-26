import React, { FunctionComponent } from 'react';
import { parse } from 'query-string';
import { RouteComponentProps } from '@reach/router';
import { navigate } from 'gatsby';

import { Row, Box, Column, PageContainer, Seo } from '@components';
import ResetPassword from '@views/ResetPassword';

type UserManagementProps = {
  location: {
    state: {
      pathname: string;
    };
  };
} & RouteComponentProps;

const isValidMode = (mode: unknown) =>
  typeof mode === 'string' && ['resetPassword', 'recoverEmail', 'verifyEmail'].includes(mode);

const isValidCode = (mode: unknown): mode is string => typeof mode === 'string';

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
              {/* {mode === 'recoverEmail' ? <RecoverEmail actionCode={actionCode} /> : null} */}
              {/* {mode === 'verifyEmail' ? <VerifyEmail actionCode={actionCode} /> : null} */}
              {!isValidMode(mode) || !isValidCode(actionCode) ? <Error /> : null}
            </Box>
          </Column>
        </Row>
      </PageContainer>
    </>
  );
};

const RecoverEmail = () => {
  return <>Verify</>;
};

const VerifyEmail = () => {
  return <>Verify</>;
};

const Error = () => {
  if (typeof window !== 'undefined') {
    navigate('/404');
  }
  return null;
};

export default UserManagement;
