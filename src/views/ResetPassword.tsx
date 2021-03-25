import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { FaCaretRight } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

import { Button, Input, Heading } from '@components';
import { requiredField } from '@utils/validations';
import { addAlert } from '@redux/ducks/globalAlerts';
import { useFirebase } from 'react-redux-firebase';
import { navigate } from 'gatsby';

type Props = { actionCode: string };

type ResetFormType = {
  password: string;
};

const ResetPassword = ({ actionCode }: Props) => {
  const [email, setEmail] = useState<string>();
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const unrecoverableError = () => {
    dispatch(
      addAlert({
        type: 'danger',
        message: 'Something went wrong, try resetting your password again',
      })
    );
    navigate('/login');
  };

  useEffect(() => {
    try {
      firebase
        .auth()
        .verifyPasswordResetCode(actionCode)
        .then((userEmail) => {
          setEmail(userEmail);
        })
        .catch(() => {
          unrecoverableError();
        });
    } catch (_) {
      unrecoverableError();
    }
  }, [firebase, actionCode]);

  const onSubmit = (
    values: ResetFormType,
    { resetForm, setSubmitting }: FormikHelpers<ResetFormType>
  ) => {
    firebase
      .auth()
      .confirmPasswordReset(actionCode, values.password)
      .then((resp) => {
        if (!email) {
          // TODO: Throw error?
          return;
        }

        setSubmitting(false);
        resetForm();
        // Password reset has been confirmed and new password updated.
        firebase.auth().signInWithEmailAndPassword(email, values.password);
        // TODO: Redirect?
      })
      .catch((error: Error) => {
        dispatch(
          addAlert({
            type: 'danger',
            message: error.message,
          })
        );
      });
  };

  const initialValues = {
    password: '',
  };

  return (
    <>
      <Heading as="h2">Password reset</Heading>
      <p>Enter your new password below.</p>
      <Formik validateOnMount initialValues={initialValues} onSubmit={onSubmit}>
        {({ isSubmitting, isValid, dirty }) => (
          <Form name="feedback" method="post" data-netlify="true">
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
                iconRight={<FaCaretRight />}
                disabled={isSubmitting || !isValid || !dirty}
              >
                Submit
              </Button>
            </p>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ResetPassword;
