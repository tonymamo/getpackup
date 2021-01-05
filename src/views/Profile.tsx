import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from 'gatsby';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';
import { actionTypes } from 'redux-firestore';
import { FaSignOutAlt } from 'react-icons/fa';
import { Formik, Form, Field } from 'formik';

import {
  Input,
  Button,
  Box,
  Avatar,
  Seo,
  PageContainer,
  FlexContainer,
  Row,
  Column,
} from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import { requiredField } from '@utils/validations';

type ProfileProps = {} & RouteComponentProps;

const Profile: FunctionComponent<ProfileProps> = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const loggedInUser = useSelector((state: RootState) => state.firestore.ordered.loggedInUser);
  const firebase = useFirebase();
  const dispatch = useDispatch();

  useFirestoreConnect([
    { collection: 'users', where: ['uid', '==', auth.uid], storeAs: 'loggedInUser' },
  ]);

  const logout = () => {
    // log out the user
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
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
    <PageContainer>
      <Seo title="Edit Profile" />
      {auth && loggedInUser && loggedInUser.length > 0 && (
        <Row>
          <Column md={8} mdOffset={2}>
            <Formik
              validateOnMount
              initialValues={{
                ...loggedInUser[0],
              }}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                firebase
                  .firestore()
                  .collection('users')
                  .doc(auth.uid)
                  .update({
                    ...values,
                  })
                  .then(() => {
                    setSubmitting(false);
                    resetForm({ values });
                    dispatch(
                      addAlert({
                        type: 'success',
                        message: `Successfully updated profile`,
                      })
                    );
                  })
                  .catch((err) => {
                    setSubmitting(false);
                    dispatch(
                      addAlert({
                        type: 'danger',
                        message: err.message,
                      })
                    );
                  });
              }}
            >
              {({ isSubmitting, isValid, setFieldValue, dirty, ...rest }) => (
                <Form>
                  <Box>
                    <FlexContainer>
                      <Avatar
                        src={auth.photoURL as string}
                        size="lg"
                        gravatarEmail={auth.email as string}
                        bottomMargin
                      />
                    </FlexContainer>
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
                      validate={validateUsername}
                      required
                    />
                    {typeof window !== 'undefined' && window.google && (
                      <Field
                        as={Input}
                        type="geosuggest"
                        geosuggestTypes={['(cities)']}
                        name="location"
                        label="Location"
                        validate={requiredField}
                        required
                        setFieldValue={setFieldValue}
                        {...rest}
                      />
                    )}
                    <Field as={Input} type="text" name="website" label="Website" />
                    <Field as={Input} type="textarea" name="bio" label="Bio" />
                    <Button type="submit" disabled={isSubmitting || !isValid || !dirty}>
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
