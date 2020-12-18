import React, { FunctionComponent, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { FaCaretRight } from 'react-icons/fa';
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import {
  Content,
  HTMLContent,
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
} from '@components';
import { requiredEmail, requiredField } from '@utils/validations';

type ContactProps = {
  hideFromCms?: boolean;
  title: string;
  content: any;
  contentComponent: typeof HTMLContent;
  heroImage: { childImageSharp: { fluid: FluidObject } };
};

export const ContactPageTemplate: FunctionComponent<ContactProps> = (props) => {
  const [sent, setSent] = useState(false);
  const initialValues = {
    email: '',
    firstName: '',
    lastName: '',
    message: '',
  };

  const PageContent = props.contentComponent || Content;

  const encode = (data: { [key: string]: string | boolean }) => {
    return Object.keys(data)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
  };

  return (
    <>
      <HeroImage imgSrc={props.heroImage}>
        <PageContainer>
          <Heading as="h1" inverse align="center">
            {props.title}
          </Heading>
        </PageContainer>
      </HeroImage>
      <PageContainer withVerticalPadding>
        {!props.hideFromCms && <Seo title={props.title} />}
        <Row>
          <Column md={6} mdOffset={3}>
            <Box>
              <PageContent content={props.content} />
              {sent && <Alert type="success" message="Thanks, we will get back to ya soon!" />}
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
                    setSent(true);
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

const ContactPage = ({
  data,
}: {
  data: { markdownRemark: { frontmatter: ContactProps; html: any } };
}) => {
  const { markdownRemark: post } = data;

  return (
    <ContactPageTemplate
      contentComponent={HTMLContent}
      title={post.frontmatter.title}
      heroImage={post.frontmatter.heroImage}
      content={post.html}
    />
  );
};

export default ContactPage;

export const contactPageQuery = graphql`
  query ContactPage {
    markdownRemark(frontmatter: { templateKey: { eq: "contact-page" } }) {
      html
      frontmatter {
        title
        heroImage {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 60) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
  }
`;
