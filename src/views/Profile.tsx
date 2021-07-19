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
  Seo,
  PageContainer,
  Row,
  Column,
  AvatarUpload,
  FlexContainer,
  HeroImageUpload,
  EditableInput,
  NegativeMarginContainer,
} from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import { requiredField } from '@utils/validations';
import validateUsername from '@utils/validateUsername';
import { offWhite } from '@styles/color';
import { baseSpacerUnit, baseSpacer, halfSpacer, sextupleSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import { AvatarImageWrapper } from '@components/Avatar';
import useWindowSize from '@utils/useWindowSize';

type ProfileProps = {
  loggedInUser?: any;
} & RouteComponentProps;

export const EmailWrapper = styled.div`
  width: 100%;
`;

const ProfileWrapper = styled.div`
  & form {
    transform: translateY(-${sextupleSpacer});
  }

  & ${AvatarImageWrapper} {
    border: 2px solid ${offWhite};
  }
`;

const Profile: FunctionComponent<ProfileProps> = ({ loggedInUser }) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const [verifySent, setVerifySent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isExtraSmallScreen } = useWindowSize();

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
        <ProfileWrapper>
          <NegativeMarginContainer
            top={baseSpacer}
            left={isExtraSmallScreen ? halfSpacer : baseSpacer}
            right={isExtraSmallScreen ? halfSpacer : baseSpacer}
          >
            <HeroImageUpload type="profile" id={auth.uid} image={loggedInUser.profileHeaderImage} />
          </NegativeMarginContainer>
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
                  setIsLoading(true);
                  firebase
                    .firestore()
                    .collection('users')
                    .doc(auth.uid)
                    .update({ ...updateValues, lastUpdated: new Date() })
                    .then(() => {
                      setSubmitting(false);
                      resetForm({ values });
                      trackEvent('Profile Updated', { ...updateValues });
                      setIsLoading(false);
                    })
                    .catch((err) => {
                      setSubmitting(false);
                      setIsLoading(false);
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
                {({ setFieldValue, values, initialValues, errors, ...rest }) => (
                  <Form>
                    <AvatarUpload loggedInUser={loggedInUser} />
                    <EditableInput
                      label="Name"
                      isLoading={isLoading}
                      value={loggedInUser.displayName}
                    >
                      <Field
                        as={Input}
                        type="text"
                        name="displayName"
                        label="Name"
                        validate={requiredField}
                        required
                        hiddenLabel
                      />
                    </EditableInput>
                    <EditableInput
                      label="Username"
                      isLoading={isLoading}
                      value={loggedInUser.username}
                    >
                      <Field
                        as={Input}
                        type="text"
                        name="username"
                        label="Username"
                        hiddenLabel
                        validate={(value: string) =>
                          validateUsername(value, initialValues.username)
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
                    </EditableInput>
                    <EditableInput label="Email" isLoading={isLoading} value={loggedInUser.email}>
                      <FlexContainer
                        flexWrap="nowrap"
                        alignItems="flex-end"
                        justifyContent="space-between"
                      >
                        <EmailWrapper>
                          <Field
                            as={Input}
                            type="text"
                            name="email"
                            label="Email"
                            disabled
                            hiddenLabel
                          />
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
                    </EditableInput>

                    {typeof window !== 'undefined' && window.google && (
                      <EditableInput
                        label="Location"
                        isLoading={isLoading}
                        value={loggedInUser.location || 'No location provided'}
                      >
                        <Field
                          as={Input}
                          type="geosuggest"
                          geosuggestTypes={['(cities)']}
                          name="location"
                          label="Location"
                          hiddenLabel
                          setFieldValue={setFieldValue}
                          {...rest}
                        />
                      </EditableInput>
                    )}
                    <EditableInput
                      label="Website"
                      isLoading={isLoading}
                      value={loggedInUser.website || 'No website provided'}
                    >
                      <Field as={Input} type="text" name="website" label="Website" hiddenLabel />
                    </EditableInput>
                    <EditableInput
                      label="Bio"
                      isLoading={isLoading}
                      value={loggedInUser.bio || 'No bio provided'}
                    >
                      <Field as={Input} type="textarea" name="bio" label="Bio" hiddenLabel />
                    </EditableInput>
                    <Button
                      type="button"
                      onClick={logout}
                      iconLeft={<FaSignOutAlt />}
                      color="dangerOutline"
                    >
                      Logout
                    </Button>
                  </Form>
                )}
              </Formik>
            </Column>
          </Row>
        </ProfileWrapper>
      )}
    </PageContainer>
  );
};

export default Profile;
