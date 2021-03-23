import React, { FunctionComponent, useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { FaCaretRight, FaUndo } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from '@reach/router';

import {
  Row,
  Box,
  Column,
  PageContainer,
  Button,
  Input,
  Seo,
  Heading,
  Alert,
  Avatar,
  FlexContainer,
} from '@components';
import postFormUrlEncoded from '@utils/postFormUrlEncoded';
import { parse } from "query-string";
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';

type FeedbackProps = {
  location: {
    state: {
      pathname: string;
    };
  };
} & RouteComponentProps;

const isValidMode = (mode) => typeof mode === 'string' && ["resetPassword", 'recoverEmail', 'verifyEmail'].includes(mode);

export const Feedback: FunctionComponent<FeedbackProps> = ({ location }) => {
  // TODO: Finish doing this
  const { mode, oobCode: actionCode } = parse(location.search);

  return (
    <>
      <PageContainer withVerticalPadding>
        <Seo title="User Management" />
        <Row>
          <Column md={8} mdOffset={2}>
            <Box>
                { mode === "resetPassword" ? <ResetPassword actionCode={actionCode} /> : null }
                { mode === "recoverEmail" ? <RecoverEmail actionCode={actionCode} /> : null }
                { mode === "verifyEmail" ? <VerifyEmail actionCode={actionCode} /> : null }
                { !isValidMode(mode) ? <Error /> : null }
            </Box>
          </Column>
        </Row>
      </PageContainer>
    </>
  );
};

const ResetPassword = (props) => {
  const [email, setEmail]= useState<string>();
  
  useEffect(() => {
    auth.verifyPasswordResetCode(actionCode).then(userEmail => {
      setEmail(email);
    }).catch((error: Error) => {
      // TODO: Fullscreen error message?
      // Invalid or expired action code. Ask user to try to reset the password
      // again.
    })
  })

  const onSubmit = (values, { resetForm, setSubmitting }) => {
    auth.confirmPasswordReset(actionCode, newPassword).then((resp) => {
      setSubmitting(false);
      resetForm();
      // Password reset has been confirmed and new password updated.
      auth.signInWithEmailAndPassword(accountEmail, newPassword);
      // TODO: Redirect?
    }).catch((error: Error) => {
      dispatch(
        addAlert({
          type: 'danger',
          message: error.message,
        })
      );
    });
  }

  const auth = useSelector((state: RootState) => state.firebase.auth);
  const dispatch = useDispatch();
  const initialValues = {
    email: auth.email || '',
    displayName: auth.displayName || '',
    page: props.location?.state?.pathname || '',
    liked: '',
    disliked: '',
    differently: '',
    missing: '',
    message: '',
  };

  return <Formik
  validateOnMount
  initialValues={initialValues}
  onSubmit={(values, { resetForm, setSubmitting }) => {
    postFormUrlEncoded('feedback', values)
      .then(() => {
        setSubmitting(false);
        resetForm();
      })
      .catch((err) => {
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
      });
  }}
>
  {({ isSubmitting, isValid, dirty, values }) => (
    <Form
      name="feedback"
      method="post"
      netlify-honeypot="bot-field"
      data-netlify="true"
    >
      <input type="hidden" name="form-name" value="feedback" />
      <input type="hidden" name="email" value={values.email} />
      <input type="hidden" name="displayName" value={values.displayName} />
      <input type="hidden" name="page" value={values.page} />
      <Heading as="h2">Thank you! 🤝</Heading>
      <p>
        We really appreciate you taking the time to provide us feedback on our app.
        Your thoughts mean so much to us and we can&apos;t thank you enough!
      </p>
      <Field
        as={Input}
        type="textarea"
        name="liked"
        label="What did you like about it?"
      />

      <Field
        as={Input}
        type="textarea"
        name="disliked"
        label="What didn't you like about it?"
      />
      <Field
        as={Input}
        type="textarea"
        name="differently"
        label="What would you do differently?"
      />
      <Field
        as={Input}
        type="textarea"
        name="missing"
        label="Is there anything we are missing or not thinking of that you would add?"
      />
      <Field
        as={Input}
        type="textarea"
        name="message"
        label="Any other feedback?"
      />
      <p>
        <Button
          type="submit"
          iconRight={<FaCaretRight />}
          disabled={isSubmitting || !isValid || !dirty}
        >
          Submit
        </Button>
        <Button
          type="link"
          to={props.location?.state?.pathname || '/'}
          color="text"
          iconLeft={<FaUndo />}
        >
          Cancel
        </Button>
      </p>
    </Form>
  )}
</Formik>

}
const RecoverEmail = () => {
  return <>Verify</>;
}

const VerifyEmail = () => {
  return <>Verify</>;
}

const Error = () => {
  return <>Verify</>;
}

export default Feedback;
