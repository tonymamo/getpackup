import React, { FunctionComponent, useState } from 'react';
import addToMailchimp, { MailchimpResponse } from 'gatsby-plugin-mailchimp';
import { Formik, Form, Field } from 'formik';

import Alert from './Alert';
import Button from './Button';
import Row from './Row';
import Column from './Column';
import Input from './Input';

import { requiredEmail } from '../utils/validations';

type SignupFormProps = {
  location: string;
};

const SignupForm: FunctionComponent<SignupFormProps> = (props) => {
  const [response, setResponse] = useState({ msg: '', result: '' });
  const initialValues = { [`email-${props.location}`]: '' };

  const getTextFromHtmlString = (s: string) => s.replace(/<.*?>*<\/.*?>/g, '');
  const getHrefFromHtmlString = (s: string) => s.match(/href="([^"]*)/)?.[1];
  const getLinkTextFromHtmlString = (s: string) => s.replace(/.*<.*?>(.*)<\/.*?>/g, '$1');
  const error = response.result === 'error';
  return (
    <Formik
      validateOnMount
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        addToMailchimp(values[`email-${props.location}`]).then((res: MailchimpResponse) => {
          setSubmitting(false);
          setResponse(res);
          window.analytics.track('Signed Up For Newsletter', {
            email: values[`email-${props.location}`],
            response: res,
            location: props.location,
          });
        });
      }}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <Row>
            <Column sm={8}>
              <Field
                as={Input}
                hideLabel
                type="email"
                name={`email-${props.location}`}
                label="Email"
                validate={requiredEmail}
              />
            </Column>
            <Column sm={4}>
              <Button color="secondary" type="submit" block disabled={isSubmitting || !isValid}>
                Subscribe
              </Button>
            </Column>
          </Row>

          {response.msg ? (
            <Alert
              type={error ? 'danger' : 'success'}
              message={error ? getTextFromHtmlString(response.msg) : response.msg}
              callToActionLink={error ? getHrefFromHtmlString(response.msg) : undefined}
              callToActionLinkText={error ? getLinkTextFromHtmlString(response.msg) : undefined}
            />
          ) : null}
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
