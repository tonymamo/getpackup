import React, { FunctionComponent, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { FaCaretRight, FaUndo } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from '@reach/router';

import {
  HeroImage,
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
import heroImage from '@images/FiveHikersNearingASnowySummit copy.jpg';
import logo from '@images/maskable_icon.png';
import { RootState } from '@redux/ducks';
import { addAlert } from '@redux/ducks/globalAlerts';

type FeedbackProps = {} & RouteComponentProps;

export const Feedback: FunctionComponent<FeedbackProps> = (props) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const dispatch = useDispatch();

  const [sent, setSent] = useState(false);

  const initialValues = {
    email: auth.email || '',
    displayName: auth.displayName || '',
    liked: '',
    disliked: '',
    differently: '',
    missing: '',
    message: '',
  };

  return (
    <>
      <HeroImage imgSrc={heroImage}>
        <PageContainer>
          <Heading as="h1" inverse align="center">
            Feedback
          </Heading>
        </PageContainer>
      </HeroImage>

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
                  <Button
                    type="link"
                    to={props.location?.state?.pathname || '/'}
                    iconLeft={<FaUndo />}
                  >
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
                        setSent(true);
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
                  {({ isSubmitting, isValid, dirty }) => (
                    <Form
                      name="feedback"
                      method="post"
                      netlify-honeypot="bot-field"
                      data-netlify="true"
                    >
                      <input type="hidden" name="form-name" value="feedback" />
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
                        name="liked"
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
              )}
            </Box>
          </Column>
        </Row>
      </PageContainer>
    </>
  );
};

export default Feedback;
