import React, { FunctionComponent } from 'react';
import { Formik, Field, Form } from 'formik';
import { navigate, Link } from 'gatsby';
import { useFirebase } from 'react-redux-firebase';
import { FaArrowRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

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
} from '@components';
import { requiredField } from '@utils/validations';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import { removeAttemptedPrivatePage } from '@redux/ducks/client';

type LoginProps = {};

const Login: FunctionComponent<LoginProps> = () => {
  const firebase = useFirebase();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const client = useSelector((state: RootState) => state.client);
  const dispatch = useDispatch();

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
                    .then(() => {
                      if (client.location) {
                        dispatch(removeAttemptedPrivatePage());
                        navigate(client.location);
                      } else {
                        navigate('/app/trips');
                      }
                    })
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
            {typeof window !== 'undefined' && <FirebaseAuthWrapper />}
          </Column>
        </Row>
      </Box>
    </PageContainer>
  );
};

export default Login;
