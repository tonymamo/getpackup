import React, { FunctionComponent, useState } from 'react';
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

  const [isLoading, setIsLoading] = useState(false);

  if (!!auth && auth.isLoaded && !auth.isEmpty) {
    navigate('/app/trips');
  }

  const initialValues = {
    displayName: '',
    username: '',
    email: '',
    password: '',
    photoURL: '',
    bio: '',
    website: '',
    location: '',
  };

  const validateUsername = async (value: string) => {
    if (value === '') {
      // return out early to avoid api calls below
      return undefined;
    }

    const searchValue = value.toLowerCase();

    const response = await firebase
      .firestore()
      .collection('users')
      .orderBy(`searchableIndex.${searchValue}`)
      .limit(5)
      .get();
    const existingUsernames: Array<any> = [];

    if (!response.empty) {
      response.forEach((doc) => existingUsernames.push(doc.data()));
    }

    let error;
    if (
      existingUsernames.filter((user) => user.uid !== auth.uid && user.username === value).length >
      0
    ) {
      error = `Sorry, ${value} is unavailable`;
    }
    return error;
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
                  setIsLoading(true);
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
                            // don't spread, we dont want password in here
                            uid: result.user.uid,
                            email: values.email,
                            displayName: values.displayName,
                            username: values.username,
                            photoURL: '',
                            bio: '',
                            website: '',
                            location: '',
                          })
                          .then(() => {
                            setIsLoading(false);
                            dispatch(
                              addAlert({
                                type: 'success',
                                message: `Successfully created profile`,
                              })
                            );
                          })
                          .catch((err) => {
                            dispatch(
                              addAlert({
                                type: 'danger',
                                message: err.message,
                              })
                            );
                          });
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
                    <Field
                      as={Input}
                      type="text"
                      name="displayName"
                      label="Full Name"
                      validate={requiredField}
                      required
                      hiddenLabel
                    />

                    <Field
                      as={Input}
                      type="text"
                      name="username"
                      label="Username"
                      validate={validateUsername}
                      required
                      hiddenLabel
                    />

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
                    <p>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isValid || isLoading}
                        isLoading={isLoading}
                        block
                      >
                        {isLoading ? 'Loading' : 'Sign Up'}
                      </Button>
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
        <p style={{ textAlign: 'center' }}>
          <small>
            Already have an account?{' '}
            <Link to="/login">
              Login now <FaArrowRight />
            </Link>
          </small>
        </p>
      </Box>
    </PageContainer>
  );
};

export default Signup;
