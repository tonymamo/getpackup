import {
  Box,
  Button,
  Column,
  FirebaseAuthWrapper,
  FlexContainer,
  Heading,
  HorizontalRule,
  Input,
  PageContainer,
  Row,
  Seo,
} from '@components';
import { RootState } from '@redux/ducks';
import { removeAttemptedPrivatePage } from '@redux/ducks/client';
import { addAlert } from '@redux/ducks/globalAlerts';
import trackEvent from '@utils/trackEvent';
import { requiredField } from '@utils/validations';
import { Field, Form, Formik } from 'formik';
import { Link, navigate } from 'gatsby';
import React, { FunctionComponent, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';

type LoginProps = {};

const Login: FunctionComponent<LoginProps> = () => {
  const firebase = useFirebase();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const client = useSelector((state: RootState) => state.client);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  if (!!auth && auth.isLoaded && !auth.isEmpty) {
    navigate('/app/trips');
  }

  const initialValues = {
    email: '',
    password: '',
  };

  return (
    <PageContainer withVerticalPadding>
      <Seo title="Log In" />
      <Box>
        <Heading align="center">Log In</Heading>
        <p style={{ textAlign: 'center' }}>
          to access your digital gear inventory and custom packing lists
        </p>
        <HorizontalRule />
        <Row>
          <Column xs={10} xsOffset={1} sm={8} smOffset={2} md={5} mdOffset={1} lg={4} lgOffset={1}>
            <FlexContainer height="100%">
              <Formik
                validateOnMount
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setIsLoading(true);
                  firebase
                    .auth()
                    .signInWithEmailAndPassword(values.email, values.password)
                    .then(() => {
                      if (client.location) {
                        trackEvent('User Logged In and Needed Redirection', {
                          location: client.location,
                          email: values.email,
                        });
                        dispatch(removeAttemptedPrivatePage());
                        navigate(client.location);
                      } else {
                        trackEvent('User Logged In', {
                          email: values.email,
                        });
                        navigate('/app/trips');
                      }
                    })
                    .catch((err) => {
                      trackEvent('User Log In Failure', {
                        error: err,
                        email: values.email,
                      });
                      dispatch(
                        addAlert({
                          type: 'danger',
                          message: err.message,
                        })
                      );
                    })
                    .finally(() => {
                      setIsLoading(false);
                      setSubmitting(false);
                    });

                  resetForm();
                }}
              >
                {({ isSubmitting, isValid }) => (
                  <Form>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      label="Email"
                      validate={requiredField}
                      required
                      hiddenLabel
                    />
                    <Field
                      as={Input}
                      type="password"
                      name="password"
                      label="Password"
                      validate={requiredField}
                      required
                      hiddenLabel
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting || !isValid || isLoading}
                      isLoading={isLoading}
                      block
                    >
                      {isLoading ? 'Logging In' : 'Log In'}
                    </Button>

                    <Button
                      type="link"
                      to="/forgot-password"
                      color="text"
                      block
                      onClick={() =>
                        trackEvent('Forgot Password Clicked', { location: 'Login Page' })
                      }
                    >
                      Forgot Password?
                    </Button>

                    <p style={{ textAlign: 'center' }}>
                      <small>
                        Don&apos;t have an account yet?{' '}
                        <Link
                          to="https://packupapp.com"
                          onClick={() =>
                            trackEvent('Sign Up Now Link Clicked', { location: 'Login Page' })
                          }
                        >
                          Sign up now <FaArrowRight />
                        </Link>
                      </small>
                    </p>
                  </Form>
                )}
              </Formik>
            </FlexContainer>
          </Column>
          <Column xs={10} xsOffset={1} sm={8} smOffset={2} md={5} lg={4} lgOffset={2}>
            {typeof window !== 'undefined' && <FirebaseAuthWrapper />}
          </Column>
        </Row>
      </Box>
    </PageContainer>
  );
};

export default Login;
