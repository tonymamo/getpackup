import React, { FunctionComponent } from 'react';
import { Formik, Field, Form } from 'formik';
import { FaCaretRight } from 'react-icons/fa';

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
} from '../components';
import { requiredEmail, requiredField } from '../utils/validations';
import image from '../images/FemaleRockclimberLookingBackAtDaybreak copy.jpg';

type ContactProps = {};

const Contact: FunctionComponent<ContactProps> = () => {
  const initialValues = {
    email: '',
    firstName: '',
    lastName: '',
    message: '',
  };

  const encode = (data: { [key: string]: string | boolean }) => {
    return Object.keys(data)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
  };

  return (
    <>
      <HeroImage imgSrc={image}>
        <PageContainer>
          <Heading as="h1" inverse align="center">
            Contact Us
          </Heading>
        </PageContainer>
      </HeroImage>
      <PageContainer withVerticalPadding>
        <Seo title="Contact Us" />
        <Row>
          <Column md={6} mdOffset={3}>
            <Box>
              <Heading>Send a Message</Heading>
              <p>
                Have a question about the product we are building, or just want to get in touch?
                Leave us a line!
              </p>
              <Formik
                validateOnMount
                initialValues={initialValues}
                onSubmit={(values, { resetForm, setSubmitting }) => {
                  fetch('https://getpackup.com/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: encode({
                      'form-name': 'contact',
                      ...values,
                    }),
                  }).then(() => {
                    setSubmitting(false);
                    resetForm();
                  });
                }}
              >
                {({ isSubmitting, isValid }) => (
                  <Form
                    name="contact"
                    method="post"
                    netlify-honeypot="bot-field"
                    data-netlify="true"
                  >
                    <input type="hidden" name="form-name" value="contact" />
                    <Row>
                      <Column sm={6}>
                        <Field
                          as={Input}
                          type="text"
                          name="firstName"
                          label="First Name"
                          validate={requiredField}
                          required
                        />
                      </Column>
                      <Column sm={6}>
                        <Field
                          as={Input}
                          type="text"
                          name="lastName"
                          label="Last Name"
                          validate={requiredField}
                          required
                        />
                      </Column>
                    </Row>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      label="Email"
                      validate={requiredEmail}
                      required
                    />

                    <Field
                      as={Input}
                      type="textarea"
                      name="message"
                      label="Message"
                      validate={requiredField}
                      required
                    />
                    <Button
                      type="submit"
                      iconRight={<FaCaretRight />}
                      disabled={isSubmitting || !isValid}
                    >
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
            </Box>
          </Column>
        </Row>
      </PageContainer>
    </>
  );
};

export default Contact;
