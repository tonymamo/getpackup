import React, { FunctionComponent, useState } from 'react';
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import addToMailchimp, { MailchimpResponse } from 'gatsby-plugin-mailchimp';
import { Formik, Form, Field } from 'formik';
import Typewriter from 'typewriter-effect';
import scrollTo from 'gatsby-plugin-smoothscroll';
import styled, { keyframes } from 'styled-components';

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
  PreviewCompatibleImage,
  FlexContainer,
  Box,
} from '../components';
import { requiredEmail, requiredField } from '../utils/validations';
import { textColor, white, brandPrimary, brandSecondary, brandTertiary } from '../styles/color';
import { quadrupleSpacer } from '../styles/size';
import mountains from '../images/mountains.svg';
import collage from '../images/Outdoorsman_Collage copy.jpg';
import wave1 from '../images/wave1.svg';

type IndexPageProps = {
  title: string;
  heroHeading: string;
  typewriterList: Array<{ text: string }>;
  heroSubheading: string;
  heroCTALink: string;
  heroCTAText: string;
  heroImage: { childImageSharp: { fluid: FluidObject } };
  mainpitch: {
    heading: string;
    subheading: string;
    text: string;
    image: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
  };
  secondpitch: {
    heading: string;
    subheading: string;
    text: string;
    image: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
  };
  thirdpitch: {
    heading: string;
    subheading: string;
    text: string;
    image: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
  };
  signupform: {
    heading: string;
    text: string;
    bgImage: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
  };
};

const Section = styled.section`
  padding: ${quadrupleSpacer} 0;
  background-color: ${(props: { backgroundColor?: string; inverse?: boolean }) =>
    props.backgroundColor};
  position: relative;
  color: ${(props) => (props.inverse ? white : textColor)};
`;

const Mountains = styled.img`
  position: absolute;
  right: 0;
  width: 25%;
  bottom: 99%;
`;

const waves = keyframes`
  from { background-position: 0; }
  to { background-position: 1600px; }
`;

const wavesReverse = keyframes`
  from { background-position: 1600px; }
  to { background-position: 0; }
`;

const WavesAnimation = styled.div`
  position: absolute;
  width: 100%;
  height: 140px;
  bottom: 0;
  left: 0;
  background: url(${(props: { wave: any }) => props.wave});
  animation: ${waves} 10s linear infinite;
  bottom: 90%;

  &:before {
    content: '';
    width: 100%;
    height: 140px;
    background: url(${(props) => props.wave});
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.4;
    animation: ${wavesReverse} 10s linear infinite;
  }

  &:after {
    content: '';
    width: 100%;
    height: 140px;
    background: url(${(props) => props.wave});
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.6;
    animation-delay: -5s;
    animation: ${waves} 20s linear infinite;
  }
`;

const UpsideDownMountains = styled.img`
  position: absolute;
  left: ${quadrupleSpacer};
  width: 25%;
  top: -1%;
  transform: rotate(180deg);
`;

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
          <Heading inverse align="center" noMargin>
            Never forget your{' '}
            <Typewriter
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
      <Section backgroundColor={brandPrimary} id="learn-more" inverse>
        <PageContainer>
          <Heading as="h1" align="center" inverse>
            {props.mainpitch.heading}
          </Heading>
        </PageContainer>
      </Section>
      <Section backgroundColor={white}>
        <Mountains src={mountains} alt="" />
        <PageContainer>
          <Row>
            <Column md={6}>
              <FlexContainer
                flexDirection="column"
                justifyContent="center"
                alignItems="start"
                height="100%"
              >
                <Heading as="h3">{props.mainpitch.subheading}</Heading>
                <p>{props.mainpitch.text}</p>
              </FlexContainer>
            </Column>
            <Column md={6}>
              <PreviewCompatibleImage imageInfo={{ image: props.mainpitch.image, alt: '' }} />
            </Column>
          </Row>
        </PageContainer>
      </Section>
      <Section backgroundColor={brandSecondary} inverse>
        <UpsideDownMountains src={mountains} alt="" />
        <PageContainer>
          <Row>
            <Column md={6}>
              <PreviewCompatibleImage imageInfo={{ image: props.secondpitch.image, alt: '' }} />
            </Column>
            <Column md={6}>
              <FlexContainer
                flexDirection="column"
                justifyContent="center"
                alignItems="start"
                height="100%"
              >
                <Heading as="h3" inverse>
                  {props.secondpitch.subheading}
                </Heading>
                <p>{props.secondpitch.text}</p>
              </FlexContainer>
            </Column>
          </Row>
        </PageContainer>
      </Section>
      <Section backgroundColor={brandTertiary} inverse>
        <WavesAnimation wave={wave1} />
        <PageContainer>
          <Row>
            <Column md={6}>
              <FlexContainer
                flexDirection="column"
                justifyContent="center"
                alignItems="start"
                height="100%"
              >
                <Heading as="h3" inverse>
                  {props.thirdpitch.subheading}
                </Heading>
                <p>{props.thirdpitch.text}</p>
              </FlexContainer>
            </Column>
            <Column md={6}>
              <PreviewCompatibleImage imageInfo={{ image: props.thirdpitch.image, alt: '' }} />
            </Column>
          </Row>
        </PageContainer>
      </Section>
      <HeroImage imgSrc={collage} parallax />
      <div id="signup">
        <Section>
          <PageContainer>
            <Row>
              <Column md={6} mdOffset={3}>
                <Box>
                  <Heading>{props.signupform.heading}</Heading>
                  <p>{props.signupform.text}</p>
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
                        window.analytics.track('Signed Up For Newsletter', {
                          firstName: values.fname,
                          lastName: values.lname,
                          email: values.email,
                          response: res,
                        });
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
                            callToActionLink={
                              error ? getHrefFromHtmlString(response.msg) : undefined
                            }
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
                </Box>
              </Column>
            </Row>
          </PageContainer>
        </Section>
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
      signupform={frontmatter.signupform}
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
          heading
          subheading
          text
          image {
            childImageSharp {
              fluid(maxWidth: 512, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        secondpitch {
          heading
          subheading
          text
          image {
            childImageSharp {
              fluid(maxWidth: 512, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        thirdpitch {
          heading
          subheading
          text
          image {
            childImageSharp {
              fluid(maxWidth: 512, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        signupform {
          heading
          text
          bgImage {
            childImageSharp {
              fluid(maxWidth: 512, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`;
