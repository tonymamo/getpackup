import { Alert, Button, Heading, Input } from '@components';
import { addAlert } from '@redux/ducks/globalAlerts';
import trackEvent from '@utils/trackEvent';
import { passwordRulesString, requiredPassword } from '@utils/validations';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { navigate } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { FaCaretRight, FaInfoCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import ReactTooltip from 'react-tooltip';
import * as Sentry from '@sentry/gatsby';

type Props = { actionCode: string };

type ResetFormType = {
  password: string;
};

const ResetPassword = ({ actionCode }: Props) => {
  const [email, setEmail] = useState<string>();
  const [displayError, setDisplayError] = useState<string>();

  const firebase = useFirebase();
  const dispatch = useDispatch();

  const unrecoverableError = () => {
    dispatch(
      addAlert({
        type: 'danger',
        message: 'Something went wrong, try resetting your password again',
      })
    );
    trackEvent('Reset Password Unrecoverable Error');
    // navigate('/login');
  };

  useEffect(() => {
    try {
      firebase
        .auth()
        .verifyPasswordResetCode(actionCode)
        .then((userEmail) => {
          setEmail(userEmail);
          trackEvent('Reset Password Verified', { userEmail });
        })
        .catch((err) => {
          unrecoverableError();
          Sentry.captureException(err);
        });
    } catch (err2) {
      unrecoverableError();
      Sentry.captureException(err2);
    }
  }, [firebase, actionCode]);

  const onSubmit = (values: ResetFormType, { setSubmitting }: FormikHelpers<ResetFormType>) => {
    setDisplayError(undefined);
    firebase
      .auth()
      .confirmPasswordReset(actionCode, values.password)
      .then((): Promise<void> => {
        if (!email) {
          trackEvent('Reset Password No Email');
          return Promise.reject(new Error('Something went wrong, please try again'));
        }

        // Password reset has been confirmed and new password updated, navigate to home page
        return firebase
          .auth()
          .signInWithEmailAndPassword(email, values.password)
          .then(() => {
            trackEvent('Reset Password Confirmed And Signed In', { email });
            navigate('/app/trips');
          });
      })
      .catch((error: Error) => {
        setDisplayError(error.message);
      })
      .finally(() => {
        setSubmitting(false);
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
        {({ isSubmitting, isValid }) => (
          <Form name="reset-password" method="post" data-netlify="true">
            {displayError ? <Alert type="danger" message={displayError} /> : null}
            <Field
              as={Input}
              type="password"
              name="password"
              label="Password"
              validate={requiredPassword}
              required
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
              hiddenLabel
            />
            <p>
              <Button
                type="submit"
                iconRight={<FaCaretRight />}
                disabled={isSubmitting || !isValid}
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
