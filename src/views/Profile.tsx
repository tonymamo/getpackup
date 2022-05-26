import { UserType } from '@common/user';
import {
  AvatarUpload,
  Button,
  Column,
  EditableInput,
  FlexContainer,
  HeroImageUpload,
  Input,
  NegativeMarginContainer,
  PageContainer,
  Row,
  Seo,
} from '@components';
import { AvatarImageWrapper } from '@components/Avatar';
import { RouteComponentProps } from '@reach/router';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';
import { brandDanger, offWhite } from '@styles/color';
import { baseSpacer, baseSpacerUnit, doubleSpacer, sextupleSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import useWindowSize from '@utils/useWindowSize';
import validateUsername from '@utils/validateUsername';
import { requiredEmail, requiredField, requiredPhoneNumber } from '@utils/validations';
import { Field, Form, Formik } from 'formik';
import { Link, navigate } from 'gatsby';
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, useState } from 'react';
import { FaSignOutAlt, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { actionTypes } from 'redux-firestore';
import styled from 'styled-components';

type ProfileProps = {
  loggedInUser?: UserType;
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

  const removeEmergencyContact = (index: number) => {
    setIsLoading(true);
    if (
      loggedInUser &&
      loggedInUser.emergencyContacts &&
      loggedInUser.emergencyContacts.length > 0
    ) {
      firebase
        .firestore()
        .collection('users')
        .doc(auth.uid)
        .update({
          emergencyContacts: firebase.firestore.FieldValue.arrayRemove(
            loggedInUser.emergencyContacts[index]
          ),
          lastUpdated: new Date(),
        })
        .then(() => {
          trackEvent('Emergency Contact Removed');
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          trackEvent('Emergency Contact Removal Failure', { error: err });
          dispatch(
            addAlert({
              type: 'danger',
              message: err.message,
            })
          );
        });
    }
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
            top={baseSpacerUnit}
            left={isExtraSmallScreen ? baseSpacerUnit / 2 : baseSpacerUnit}
            right={isExtraSmallScreen ? baseSpacerUnit / 2 : baseSpacerUnit}
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
                  newEmergencyContactName: '',
                  newEmergencyContactPhoneNumber: '',
                  newEmergencyContactEmail: '',
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // Note: This prevents photo url from overwriting any change as the avatar
                  // file uploader handles saving itself.
                  // Remove email and emergency contact fields as well since we don't want the user
                  // updating their email here, and the EC fields are just for the form
                  const {
                    photoURL,
                    email,
                    newEmergencyContactName,
                    newEmergencyContactEmail,
                    newEmergencyContactPhoneNumber,
                    ...updateValues
                  } = values;
                  setIsLoading(true);
                  firebase
                    .firestore()
                    .collection('users')
                    .doc(auth.uid)
                    .update({
                      ...updateValues,
                      emergencyContacts:
                        values.newEmergencyContactName !== ''
                          ? firebase.firestore.FieldValue.arrayUnion({
                              name: newEmergencyContactName,
                              email: newEmergencyContactEmail,
                              phoneNumber: newEmergencyContactPhoneNumber,
                            })
                          : [...(values.emergencyContacts || [])],
                      lastUpdated: new Date(),
                    })
                    .then(() => {
                      setSubmitting(false);
                      resetForm({
                        values: {
                          ...updateValues,
                          email: auth.email,
                          newEmergencyContactName: '',
                          newEmergencyContactPhoneNumber: '',
                          newEmergencyContactEmail: '',
                        },
                      });
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
                        type="username"
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
                            helpText={
                              <span>
                                Please <Link to="/contact">contact us</Link> to change your email
                                address
                              </span>
                            }
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
                      <Field
                        as={Input}
                        type="textarea"
                        maxLength={2000}
                        name="bio"
                        label="Bio"
                        helpText="2000 character limit"
                        hiddenLabel
                      />
                    </EditableInput>
                    <EditableInput
                      label="Emergency Contacts"
                      isLoading={isLoading}
                      actionName="Add"
                      value={
                        loggedInUser.emergencyContacts &&
                        loggedInUser.emergencyContacts.length > 0 ? (
                          <table
                            style={{ width: '100%', tableLayout: 'fixed' }}
                            className="no-border"
                          >
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Contact Info</th>
                                <th style={{ width: doubleSpacer }}>&nbsp;</th>
                              </tr>
                            </thead>
                            <tbody>
                              {loggedInUser.emergencyContacts &&
                                loggedInUser.emergencyContacts.length > 0 &&
                                loggedInUser.emergencyContacts.map((contact, index) => (
                                  <tr key={contact.name + contact.email + contact.phoneNumber}>
                                    <td style={{ wordBreak: 'break-all' }}>{contact.name}</td>
                                    <td style={{ wordBreak: 'break-all', lineHeight: 1.2 }}>
                                      <small>{contact.phoneNumber}</small>
                                      <br />
                                      <small>{contact.email}</small>
                                    </td>
                                    <td align="right">
                                      <FaTrash
                                        style={{ cursor: 'pointer' }}
                                        color={brandDanger}
                                        onClick={() => removeEmergencyContact(index)}
                                      />
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        ) : (
                          'No Emergency Contacts'
                        )
                      }
                    >
                      <Field
                        as={Input}
                        type="text"
                        name="newEmergencyContactName"
                        label="Name"
                        required
                        validate={requiredField}
                        maxLength={50}
                      />

                      <Field
                        as={Input}
                        type="tel"
                        name="newEmergencyContactPhoneNumber"
                        label="Phone"
                        required
                        validate={requiredPhoneNumber}
                      />

                      <Field
                        as={Input}
                        type="email"
                        name="newEmergencyContactEmail"
                        label="Email"
                        required
                        validate={requiredEmail}
                      />
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
