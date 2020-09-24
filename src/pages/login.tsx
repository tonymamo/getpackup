import React, { FunctionComponent } from 'react';
import { Formik, Field, Form } from 'formik';
import { navigate, Link } from 'gatsby';
import firebase from 'gatsby-plugin-firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FaArrowRight } from 'react-icons/fa';

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
} from '../components';
import FirebaseAuthWrapper, { uiConfig } from '../components/FirebaseAuthWrapper';
import { requiredField } from '../utils/validations';
import useAuthState from '../utils/useFirebaseAuth';

type LoginProps = {};

const Login: FunctionComponent<LoginProps> = () => {
  const [user, loading, error] = useAuthState(firebase);

  if (!!user && !loading && !error) {
    navigate('/app/profile');
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
                onSubmit={(values, { setSubmitting }) => {
                  firebase
                    .auth()
                    .signInWithEmailAndPassword(values.email, values.password)
                    .catch((err: { message: string }) => {
                      alert(err.message);
                    });
                  setSubmitting(false);
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
                      hideLabel
                    />
                    <Field
                      as={Input}
                      type="password"
                      name="password"
                      label="Password"
                      validate={requiredField}
                      required
                      hideLabel
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
