import {
  Alert,
  Box,
  Button,
  Column,
  FlexContainer,
  Heading,
  Input,
  PageContainer,
  Row,
  Seo,
} from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import trackEvent from '@utils/trackEvent';
import { requiredField } from '@utils/validations';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { Link } from 'gatsby';
import React, { FunctionComponent, useState } from 'react';
import { FaCaretRight } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';

type ForgotPasswordProps = {};

type ForgotPasswordForm = {
  email: string;
};

export const ForgotPassword: FunctionComponent<ForgotPasswordProps> = () => {
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const [displayError, setDisplayError] = useState<string>();

  const onSubmit = (
    values: ForgotPasswordForm,
    { resetForm, setSubmitting }: FormikHelpers<ForgotPasswordForm>
  ) => {
    setDisplayError(undefined);

    firebase
      .auth()
      .sendPasswordResetEmail(values.email)
      .then(() => {
        resetForm();
        trackEvent('Forgot Password Submitted', { email: values.email });
        dispatch(
          addAlert({
            type: 'success',
            message: 'Check your email inbox to reset your password',
          })
        );
      })
      .catch((error: Error) => {
        trackEvent('Forgot Password Submit Failure', { email: values.email, error });
        setDisplayError(error.message);
      })
      .finally(() => {
        setSubmitting(false);
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
                {({ isSubmitting, isValid }) => (
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
                    {displayError ? <Alert type="danger" message={displayError} /> : null}
                    <FlexContainer justifyContent="space-between">
                      <p>
                        <Button
                          type="submit"
                          iconRight={<FaCaretRight />}
                          disabled={isSubmitting || !isValid}
                        >
                          Submit
                        </Button>
                      </p>

                      <p>
                        <Link to="https://packupapp.com">Back to login</Link>
                      </p>
                    </FlexContainer>
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
