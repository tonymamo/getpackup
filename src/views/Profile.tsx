import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from 'gatsby';
import { useFirebase } from 'react-redux-firebase';
import { actionTypes } from 'redux-firestore';
import { FaSignOutAlt } from 'react-icons/fa';
import { Formik, Form, Field } from 'formik';
import styled from 'styled-components';

import {
  Input,
  Button,
  Box,
  Seo,
  PageContainer,
  Row,
  Column,
  AvatarUpload,
  FlexContainer,
} from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import { requiredField } from '@utils/validations';
import validateUsername from '@utils/validateUsername';
import { baseSpacerUnit, baseSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';

type ProfileProps = {
  loggedInUser?: any;
} & RouteComponentProps;

export const EmailWrapper = styled.div`
  width: 100%;
`;

const Profile: FunctionComponent<ProfileProps> = ({ loggedInUser }) => {
  const [verifySent, setVerifySent] = useState(false);
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const logout = () => {
    // log out the user
    firebase
      .auth()
      .signOut()
      .then(() => {
        trackEvent('Logout Clicked', { location: 'Profile' });
        navigate('/');
      })
      .catch((err) => {
        trackEvent('Logout Failure', { location: 'Profile', error: err });
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
    // clear redux store http://react-redux-firebase.com/docs/auth.html#logout
    firebase.logout().then(() => {
      // https://github.com/prescottprue/redux-firestore/issues/114
      dispatch({ type: actionTypes.CLEAR_DATA });
    });
  };

  const verifyEmail = () => {
    const user = firebase.auth().currentUser;

    if (!user) {
      trackEvent('Verify Email Attempted', { error: 'Not logged in' });
      dispatch(
        addAlert({
          type: 'danger',
          message: 'You are not currently signed in',
        })
      );
      return;
    }
    user
      .sendEmailVerification()
      .then(() => {
        setVerifySent(true);
        trackEvent('Verify Email Sent');
        dispatch(
          addAlert({
            type: 'success',
            message: 'Verification email sent',
          })
        );
      })
      .catch((err) => {
        trackEvent('Verify Email Send Failure');
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
  };

  return (
    <PageContainer>
      <Seo title="Edit Profile">
        {typeof google !== 'object' && (
          <script
            type="text/javascript"
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GATSBY_GOOGLE_MAPS_API_KEY}&libraries=places`}
          />
        )}
      </Seo>
      {auth && loggedInUser && (
        <Row>
          <Column md={8} mdOffset={2}>
            <Formik
              validateOnMount
              initialValues={{
                ...loggedInUser,
                email: auth.email,
              }}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                // Note: This prevents photo url from overwriting any change as the avatar
                // file uploader handles saving itself.
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { photoURL, email, ...updateValues } = values;

                firebase
                  .firestore()
                  .collection('users')
                  .doc(auth.uid)
                  .update({ ...updateValues, lastUpdated: new Date() })
                  .then(() => {
                    setSubmitting(false);
                    resetForm({ values });
                    trackEvent('Profile Updated', { ...updateValues });
                    dispatch(
                      addAlert({
                        type: 'success',
                        message: `Successfully updated profile`,
                      })
                    );
                  })
                  .catch((err) => {
                    setSubmitting(false);
                    trackEvent('Profile Update Failure', { error: err, ...updateValues });
                    dispatch(
                      addAlert({
                        type: 'danger',
                        message: err.message,
                      })
                    );
                  });
              }}
            >
              {({
                isSubmitting,
                isValid,
                setFieldValue,
                values,
                initialValues,
                errors,
                ...rest
              }) => (
                <Form>
                  <Box>
                    <AvatarUpload loggedInUser={loggedInUser} />
                    <Field
                      as={Input}
                      type="text"
                      name="displayName"
                      label="Name"
                      validate={requiredField}
                      required
                    />
                    <Field
                      as={Input}
                      type="text"
                      name="username"
                      label="Username"
                      validate={(value: string) =>
                        validateUsername(value, firebase, '', initialValues.username)
                      }
                      required
                      helpText={
                        values.username.length > 3 &&
                        !errors.username &&
                        loggedInUser.username !== values.username // initialValues is set from loggedInUser
                          ? `${values.username} is available!`
                          : ''
                      }
                    />
                    <FlexContainer
                      flexWrap="nowrap"
                      alignItems="flex-end"
                      justifyContent="space-between"
                    >
                      <EmailWrapper>
                        <Field as={Input} type="text" name="email" label="Email" disabled />
                      </EmailWrapper>
                      {auth.emailVerified ? null : (
                        <Button
                          onClick={verifyEmail}
                          type="button"
                          disabled={verifySent}
                          style={{ marginBottom: baseSpacerUnit + 1, marginLeft: baseSpacer }}
                        >
                          Verify
                        </Button>
                      )}
                    </FlexContainer>

                    {typeof window !== 'undefined' && window.google && (
                      <Field
                        as={Input}
                        type="geosuggest"
                        geosuggestTypes={['(cities)']}
                        name="location"
                        label="Location"
                        setFieldValue={setFieldValue}
                        {...rest}
                      />
                    )}
                    <Field as={Input} type="text" name="website" label="Website" />
                    <Field as={Input} type="textarea" name="bio" label="Bio" />
                    <Button type="submit" disabled={isSubmitting || !isValid}>
                      Save
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Column>
        </Row>
      )}
      <Button type="button" onClick={logout} iconLeft={<FaSignOutAlt />} color="dangerOutline">
        Logout
      </Button>
    </PageContainer>
  );
};

export default Profile;
