import React, { FunctionComponent, useState } from 'react';
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import addToMailchimp, { MailchimpResponse } from 'gatsby-plugin-mailchimp';
import { Formik, Form, Field } from 'formik';
import TypewriterEffect from 'typewriter-effect';
import scrollTo from 'gatsby-plugin-smoothscroll';

import {
  Alert,
  Seo,
  HeroImage,
  Input,
  Button,
  PageContainer,
  Row,
  Column,
  Heading,
} from '../components';
import { requiredEmail, requiredField } from '../utils/validations';
import { white, brandSecondary, brandTertiary } from '../styles/color';

type IndexPageProps = {
  title: string;
  heroHeading: string;
  typewriterList: Array<{ text: string }>;
  heroSubheading: string;
  heroCTALink: string;
  heroCTAText: string;
  heroImage: { childImageSharp: { fluid: FluidObject } };
  mainpitch: {
    title: string;
    bgImage: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
    cards: Array<{
      title: string;
      text: string;
      image: {
        childImageSharp: {
          fluid: FluidObject;
        };
      };
      icon?: {
        childImageSharp: {
          fluid: FluidObject;
        };
      };
      link: string;
      linkText: string;
      linkType: 'button' | 'link';
    }>;
  };
  secondpitch: {
    title: string;
    text: string;
    caption: string;
    image: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
    link: string;
    linkText: string;
    linkType: 'button' | 'link';
  };
  thirdpitch: {
    title: string;
    text: string;
    caption: string;
    image: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
    link: string;
    linkText: string;
    linkType: 'button' | 'link';
  };
};

export const IndexPageTemplate: FunctionComponent<IndexPageProps> = (props) => {
  const [response, setResponse] = useState({ msg: '', result: '' });
  const initialValues = { fname: '', lname: '', email: '' };

  const getTextFromHtmlString = (s: string) => s.replace(/<.*?>*<\/.*?>/g, '');
  const getHrefFromHtmlString = (s: string) => s.match(/href="([^"]*)/)?.[1];
  const getLinkTextFromHtmlString = (s: string) => s.replace(/.*<.*?>(.*)<\/.*?>/g, '$1');
  const error = response.result === 'error';

  return (
    <>
      <Seo title={props.title} />
      <HeroImage imgSrc={props.heroImage.childImageSharp.fluid.src}>
        <PageContainer>
          <Heading inverse align="center">
            Never forget your{' '}
            <TypewriterEffect
              options={{
                strings: props.typewriterList.map((arr) => arr.text),
                autoStart: true,
                loop: true,
              }}
            />{' '}
            again
          </Heading>
          <p>{props.heroSubheading}</p>
          <Button type="button" onClick={() => scrollTo(props.heroCTALink)}>
            {props.heroCTAText}
          </Button>
        </PageContainer>
      </HeroImage>
      <div style={{ backgroundColor: white, height: 400 }}>
        <PageContainer>another section</PageContainer>
      </div>
      <div style={{ backgroundColor: brandSecondary, height: 400 }}>
        <PageContainer>another section</PageContainer>
      </div>
      <div style={{ backgroundColor: brandTertiary, height: 400 }}>
        <PageContainer>another section</PageContainer>
      </div>
      <div
        id="signup"
        style={{
          background: `url('${props.mainpitch.bgImage.childImageSharp.fluid.src}')`,
          padding: 32,
        }}
      >
        <Row>
          <Column md={6} mdOffset={3}>
            <Heading>Stay Up to Date</Heading>
            <p>Enter your name and email to get periodic updates about Packup</p>
            <Formik
              validateOnMount
              initialValues={initialValues}
              onSubmit={(values, { setSubmitting }) => {
                addToMailchimp(values.email, {
                  FNAME: values.fname,
                  LNAME: values.lname,
                }).then((res: MailchimpResponse) => {
                  setSubmitting(false);
                  setResponse(res);
                });
              }}
            >
              {({ isSubmitting, isValid }) => (
                <Form>
                  <Row>
                    <Column md={6}>
                      <Field
                        as={Input}
                        type="text"
                        name="fname"
                        label="First Name"
                        required
                        validate={requiredField}
                      />
                    </Column>
                    <Column md={6}>
                      <Field
                        as={Input}
                        type="text"
                        name="lname"
                        label="Last Name"
                        required
                        validate={requiredField}
                      />
                    </Column>
                  </Row>
                  <Field
                    as={Input}
                    type="email"
                    name="email"
                    label="Email"
                    required
                    validate={requiredEmail}
                  />
                  {response.msg ? (
                    <Alert
                      type={error ? 'danger' : 'success'}
                      message={error ? getTextFromHtmlString(response.msg) : response.msg}
                      callToActionLink={error ? getHrefFromHtmlString(response.msg) : undefined}
                      callToActionLinkText={
                        error ? getLinkTextFromHtmlString(response.msg) : undefined
                      }
                    />
                  ) : (
                    <Button type="submit" block disabled={isSubmitting || !isValid}>
                      Submit
                    </Button>
                  )}
                </Form>
              )}
            </Formik>
          </Column>
        </Row>
      </div>
    </>
  );
};

const IndexPage = ({ data }: { data: { markdownRemark: { frontmatter: IndexPageProps } } }) => {
  const { frontmatter } = data.markdownRemark;
  return (
    <IndexPageTemplate
      heroImage={frontmatter.heroImage}
      title={frontmatter.title}
      heroHeading={frontmatter.heroHeading}
      typewriterList={frontmatter.typewriterList}
      heroSubheading={frontmatter.heroSubheading}
      heroCTALink={frontmatter.heroCTALink}
      heroCTAText={frontmatter.heroCTAText}
      mainpitch={frontmatter.mainpitch}
      secondpitch={frontmatter.secondpitch}
      thirdpitch={frontmatter.thirdpitch}
    />
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        title
        heroImage {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        heroHeading
        typewriterList {
          text
        }
        heroSubheading
        heroCTALink
        heroCTAText
        mainpitch {
          title
          bgImage {
            childImageSharp {
              fluid(maxWidth: 512, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          cards {
            title
            text
            image {
              childImageSharp {
                fluid(maxWidth: 512, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            icon {
              childImageSharp {
                fluid(maxWidth: 512, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            link
            linkText
            linkType
          }
        }
        secondpitch {
          title
          text
          caption
          image {
            childImageSharp {
              fluid(maxWidth: 400, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          link
          linkText
          linkType
        }
        thirdpitch {
          title
          text
          caption
          image {
            childImageSharp {
              fluid(maxWidth: 1200, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          link
          linkText
          linkType
        }
      }
    }
  }
`;
