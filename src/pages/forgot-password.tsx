import React, { FunctionComponent } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { FaCaretRight } from 'react-icons/fa';

import { Row, Box, Column, PageContainer, Seo, Heading, Input, Button } from '@components';
import { requiredField } from '@utils/validations';
import { addAlert } from '@redux/ducks/globalAlerts';

type ForgotPasswordProps = {};

type ForgotPasswordForm = {
  email: string;
};

export const ForgotPassword: FunctionComponent<ForgotPasswordProps> = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const onSubmit = (
    values: ForgotPasswordForm,
    { resetForm, setSubmitting }: FormikHelpers<ForgotPasswordForm>
  ) => {
    firebase
      .auth()
      .sendPasswordResetEmail(values.email)
      .then(() => {
        setSubmitting(false);
        resetForm();

        dispatch(
          addAlert({
            type: 'success',
            message: 'Check your email inbox to reset your password',
          })
        );
      })
      .catch((error: Error) => {
        dispatch(
          addAlert({
            type: 'danger',
            message: error.message,
          })
        );
      });
  };

  const initialValues = {
    email: '',
  };

  return (
    <>
      <PageContainer withVerticalPadding>
        <Seo title="Forgot password" />
        <Row>
          <Column md={8} mdOffset={2}>
            <Box>
              <Heading as="h2">Forgot your password?</Heading>
              <p>It&apos;s better to forget your password, than to forget your passport!</p>
              <Formik validateOnMount initialValues={initialValues} onSubmit={onSubmit}>
                {({ isSubmitting, isValid, dirty }) => (
                  <Form name="forgot-password">
                    <Field
                      as={Input}
                      type="text"
                      name="email"
                      label="Email"
                      validate={requiredField}
                      required
                      hiddenLabel
                    />
                    <p>
                      <Button
                        type="submit"
                        iconRight={<FaCaretRight />}
                        disabled={isSubmitting || !isValid || !dirty}
                      >
                        Submit
                      </Button>
                    </p>
                  </Form>
                )}
              </Formik>
            </Box>
          </Column>
        </Row>
      </PageContainer>
    </>
  );
};

export default ForgotPassword;
