import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from 'gatsby';
import { useFirebase } from 'react-redux-firebase';
import { actionTypes } from 'redux-firestore';
import { FaSignOutAlt } from 'react-icons/fa';
import { Formik, Form, Field } from 'formik';

import { Input, Button, Box, Seo, PageContainer, Row, Column, FileUpload } from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import { RootState } from '@redux/ducks';
import { requiredField } from '@utils/validations';
import validateUsername from '@utils/validateUsername';

type ProfileProps = {
  loggedInUser?: any;
} & RouteComponentProps;

const Profile: FunctionComponent<ProfileProps> = ({ loggedInUser }) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();
  const dispatch = useDispatch();

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

  return (
    <PageContainer>
      <Seo title="Edit Profile" />
      {auth && loggedInUser && (
        <Row>
          <Column md={8} mdOffset={2}>
            <Formik
              validateOnMount
              initialValues={{
                ...loggedInUser,
              }}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                // Note: This prevents photo url from overwriting any change as the avatar
                // file uploader handles saving itself.
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { photoURL, ...updateValues } = values;

                firebase
                  .firestore()
                  .collection('users')
                  .doc(auth.uid)
                  .update(updateValues)
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
              {({ isSubmitting, isValid, setFieldValue, dirty, values, errors, ...rest }) => (
                <Form>
                  <Box>
                    <FileUpload loggedInUser={loggedInUser} />
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
                      validate={(value: string) => validateUsername(value, firebase, '')}
                      required
                      helpText={
                        values.username.length > 3 &&
                        !errors.username &&
                        loggedInUser.username !== values.username // initialValues is set from loggedInUser
                          ? `${values.username} is available!`
                          : ''
                      }
                    />
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
