import {
  Alert,
  Avatar,
  Box,
  Button,
  Column,
  FlexContainer,
  Heading,
  Input,
  PageContainer,
  Row,
  Seo,
} from '@components';
import logo from '@images/maskable_icon.png';
import { RouteComponentProps, navigate } from '@reach/router';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';
import postFormUrlEncoded from '@utils/postFormUrlEncoded';
import trackEvent from '@utils/trackEvent';
import { Field, Form, Formik } from 'formik';
import React, { FunctionComponent, useState } from 'react';
import { FaCaretRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

type FeedbackProps = {
  location?: {
    state: {
      pathname: string;
    };
  };
} & RouteComponentProps;

export const Feedback: FunctionComponent<FeedbackProps> = (props) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const dispatch = useDispatch();

  const [sent, setSent] = useState(false);

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

  return (
    <>
      <PageContainer withVerticalPadding>
        <Seo title="Feedback" />
        <Row>
          <Column md={8} mdOffset={2}>
            <Box>
              {sent ? (
                <FlexContainer flexDirection="column">
                  <Alert type="success" message="Thanks again, we really appreciate it!" />
                  <Avatar src={logo} size="lg" gravatarEmail="" bottomMargin />
                  <p>With love,</p>
                  <Heading as="h2">Taylor, Mack, &amp; Tony 😘</Heading>
                  <Button type="button" onClick={() => navigate(-1)} color="text">
                    Go Back
                  </Button>
                </FlexContainer>
              ) : (
                <Formik
                  validateOnMount
                  initialValues={initialValues}
                  onSubmit={(values, { resetForm, setSubmitting }) => {
                    postFormUrlEncoded('feedback', values)
                      .then(() => {
                        trackEvent('Feedback Forms Submitted', values);
                        setSent(true);
                        setSubmitting(false);
                        resetForm();
                      })
                      .catch((err) => {
                        trackEvent('Feedback Forms Submitted', { ...values, error: err });
                        dispatch(
                          addAlert({
                            type: 'danger',
                            message: err.message,
                          })
                        );
                      });
                  }}
                >
                  {({ isSubmitting, isValid, values }) => (
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
                          rightSpacer
                          iconRight={<FaCaretRight />}
                          disabled={isSubmitting || !isValid}
                        >
                          Submit
                        </Button>
                        <Button type="button" onClick={() => navigate(-1)} color="text">
                          Cancel
                        </Button>
                      </p>
                    </Form>
                  )}
                </Formik>
              )}
            </Box>
          </Column>
        </Row>
      </PageContainer>
    </>
  );
};

export default Feedback;
