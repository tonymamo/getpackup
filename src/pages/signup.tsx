import React, { FunctionComponent } from 'react';
import { Formik, Field, Form } from 'formik';
import { navigate, Link } from 'gatsby';
import { FaArrowRight } from 'react-icons/fa';
import { useFirebase } from 'react-redux-firebase';
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

type SignupProps = {};

const Signup: FunctionComponent<SignupProps> = () => {
  const firebase = useFirebase();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const dispatch = useDispatch();

  if (!!auth && auth.isLoaded && !auth.isEmpty) {
    navigate('/app/trips');
  }

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <PageContainer withVerticalPadding>
      <Seo title="Sign Up" />
      <Box>
        <Heading align="center">Sign Up</Heading>
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
                    .createUserWithEmailAndPassword(values.email, values.password)
                    .then((result: any) => {
                      if (result.user) {
                        firebase
                          .firestore()
                          .collection('users')
                          .doc(result.user.uid)
                          .set({
                            email: values.email,
                            firstName: values.firstName,
                            lastName: values.lastName,
                          });
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
                }}
              >
                {({ isSubmitting, isValid }) => (
                  <Form>
                    <Row>
                      <Column sm={6}>
                        <Field
                          as={Input}
                          type="text"
                          name="firstName"
                          label="First Name"
                          validate={requiredField}
                          required
                          hiddenLabel
                        />
                      </Column>
                      <Column sm={6}>
                        <Field
                          as={Input}
                          type="text"
                          name="lastName"
                          label="Last Name"
                          validate={requiredField}
                          required
                          hiddenLabel
                        />
                      </Column>
                    </Row>
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
                    <Field
                      as={Input}
                      type="password"
                      name="confirmPassword"
                      label="Confirm Password"
                      validate={requiredField}
                      required
                      hiddenLabel
                    />
                    <p>
                      <Button type="submit" disabled={isSubmitting || !isValid} block>
                        Sign Up
                      </Button>
                    </p>
                    <p style={{ textAlign: 'center' }}>
                      <small>
                        Already have an account?{' '}
                        <Link to="/login">
                          Login now <FaArrowRight />
                        </Link>
                      </small>
                    </p>
                  </Form>
                )}
              </Formik>
            </FlexContainer>
          </Column>
          <Column xs={10} xsOffset={1} sm={8} smOffset={2} md={5} lg={4} lgOffset={2}>
            <FlexContainer height="100%" flexDirection="column">
              <p>
                <small>Or, sign up with one of the following:</small>
              </p>
              {typeof window !== 'undefined' && <FirebaseAuthWrapper />}
            </FlexContainer>
          </Column>
        </Row>
      </Box>
    </PageContainer>
  );
};

export default Signup;
