import React, { FunctionComponent } from 'react';
import { Formik, Field, Form } from 'formik';
import { navigate, Link } from 'gatsby';
import firebase from 'gatsby-plugin-firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FaArrowRight } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

import {
  Row,
  Column,
  PageContainer,
  Box,
  Button,
  Input,
  HorizontalRule,
  Seo,
  Heading,
  FlexContainer,
  FirebaseAuthWrapper,
  uiConfig,
} from '@components';
import { requiredField } from '@utils/validations';
import useAuthState from '@utils/useFirebaseAuth';
import { addAlert } from '@redux/ducks/globalAlerts';

type LoginProps = {};

const Login: FunctionComponent<LoginProps> = () => {
  const [user, loading, error] = useAuthState(firebase);
  const dispatch = useDispatch();
  if (!!user && !loading && !error) {
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
        <Heading align="center">Login</Heading>
        <p style={{ textAlign: 'center' }}>
          Adventure made easy&mdash;never forget important gear again!
        </p>
        <HorizontalRule />
        <Row>
          <Column xs={10} xsOffset={1} sm={8} smOffset={2} md={5} mdOffset={1} lg={4} lgOffset={1}>
            <FlexContainer height="100%">
              <Formik
                validateOnMount
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  firebase
                    .auth()
                    .signInWithEmailAndPassword(values.email, values.password)
                    .catch((err) => {
                      dispatch(
                        addAlert({
                          type: 'danger',
                          message: err.message,
                        })
                      );
                    });
                  setSubmitting(false);
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

                    <Button type="submit" disabled={isSubmitting || !isValid} block>
                      Log In
                    </Button>

                    <Button type="link" to="/forgot-password" color="text" block>
                      Forgot Password?
                    </Button>

                    <p style={{ textAlign: 'center' }}>
                      <small>
                        Don&apos;t have an account yet?{' '}
                        <Link to="/signup">
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
            {typeof window !== 'undefined' && (
              <FirebaseAuthWrapper>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
              </FirebaseAuthWrapper>
            )}
          </Column>
        </Row>
      </Box>
    </PageContainer>
  );
};

export default Login;
