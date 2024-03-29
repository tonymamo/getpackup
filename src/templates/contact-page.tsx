import { FluidImageType } from '@common/image';
import {
  Alert,
  Box,
  Button,
  Column,
  Content,
  HTMLContent,
  Heading,
  HeroImage,
  Input,
  PageContainer,
  Row,
  Seo,
} from '@components';
import postFormUrlEncoded from '@utils/postFormUrlEncoded';
import trackEvent from '@utils/trackEvent';
import { requiredEmail, requiredField } from '@utils/validations';
import { Field, Form, Formik } from 'formik';
import { graphql } from 'gatsby';
import React, { FunctionComponent, useState } from 'react';
import { FaCaretRight } from 'react-icons/fa';

type ContactProps = {
  hideFromCms?: boolean;
  title: string;
  content: any;
  contentComponent: typeof HTMLContent;
  heroImage: FluidImageType;
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
                  postFormUrlEncoded('contact', values).then(() => {
                    trackEvent('Contact Page Form Submitted', { values });
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
  data: {
    markdownRemark: { frontmatter: ContactProps; html: any; heroImage: ContactProps['heroImage'] };
  };
}) => {
  const { markdownRemark: post } = data;

  return (
    <ContactPageTemplate
      contentComponent={HTMLContent}
      title={post.frontmatter.title}
      heroImage={post.heroImage}
      content={post.html}
    />
  );
};

export default ContactPage;

export const contactPageQuery = graphql`
  query ContactPage {
    markdownRemark(frontmatter: { templateKey: { eq: "contact-page" } }) {
      html
      heroImage {
        fluid {
          ...CloudinaryAssetFluid
        }
      }
      frontmatter {
        title
      }
    }
  }
`;
