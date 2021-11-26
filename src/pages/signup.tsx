import React, { FunctionComponent, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { navigate, Link } from 'gatsby';
import { FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';

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
import {
  passwordRulesString,
  requiredEmail,
  requiredField,
  requiredPassword,
} from '@utils/validations';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import validateUsername from '@utils/validateUsername';
import trackEvent from '@utils/trackEvent';

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
                      trackEvent('New User Signed Up', { email: values.email });
                      if (result.user) {
                        return firebase
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
                            lastUpdated: new Date(),
                            createdAt: new Date(),
                          })
                          .then(() => {
                            trackEvent('New User Signed Up And Created Profile', {
                              email: values.email,
                            });
                          })
                          .catch((err) => {
                            trackEvent('New User Signed Up And Profile Creation Failed', {
                              email: values.email,
                              error: err,
                            });
                            dispatch(
                              addAlert({
                                type: 'danger',
                                message: err.message,
                              })
                            );
                          });
                      }
                      return Promise.resolve();
                    })
                    .catch((err) => {
                      trackEvent('New User Sign Up Failed', {
                        email: values.email,
                        error: err,
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
                }}
              >
                {({ isSubmitting, isValid, errors, values }) => (
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
                      type="username"
                      name="username"
                      label="Username"
                      validate={(value: string) => validateUsername(value, '')}
                      required
                      hiddenLabel
                      helpText={
                        values.username.length > 3 && !errors.username
                          ? `${values.username} is available!`
                          : ''
                      }
                    />

                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      label="Email"
                      validate={requiredEmail}
                      required
                      hiddenLabel
                    />
                    <Field
                      as={Input}
                      type="password"
                      name="password"
                      label="Password"
                      validate={requiredPassword}
                      helpText={
                        <span data-tip={passwordRulesString} data-for="requirements">
                          Password requirements <FaInfoCircle />
                          <ReactTooltip
                            id="requirements"
                            place="bottom"
                            type="dark"
                            effect="solid"
                            className="tooltip customTooltip customTooltip200"
                            delayShow={500}
                          />
                        </span>
                      }
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
              Log in now <FaArrowRight />
            </Link>
          </small>
        </p>
      </Box>
    </PageContainer>
  );
};

export default Signup;
