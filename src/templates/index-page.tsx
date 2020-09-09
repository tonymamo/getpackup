import React, { FunctionComponent, useState } from 'react';
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import addToMailchimp, { MailchimpResponse } from 'gatsby-plugin-mailchimp';
import { Formik, Form, Field } from 'formik';
import Typewriter from 'typewriter-effect';
import scrollTo from 'gatsby-plugin-smoothscroll';
import styled, { keyframes } from 'styled-components';
import Carousel from 'react-bootstrap/Carousel';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

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
  FlexContainer,
  Box,
  Testimonial,
} from '../components';
import { requiredEmail, requiredField } from '../utils/validations';
import {
  textColor,
  white,
  brandPrimary,
  brandSecondary,
  brandTertiary,
  lightestGray,
} from '../styles/color';
import { screenSizes, quadrupleSpacer, breakpoints, doubleSpacer } from '../styles/size';
import collage from '../images/Outdoorsman_Collage copy.jpg';
import waveBismark from '../images/wave-bismark.svg';
import waveDownriver from '../images/wave-downriver.svg';
import useWindowSize from '../utils/useWindowSize';

type IndexPageProps = {
  title: string;
  heroHeading: string;
  typewriterList: Array<{ text: string }>;
  heroSubheading: string;
  heroCTALink: string;
  heroCTAText: string;
  heroImage: { childImageSharp: { fluid: FluidObject } };
  mobileHeroImage: { childImageSharp: { fluid: FluidObject } };
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
  testimonials: Array<{
    quote: string;
    author: string;
    location: string;
    avatar: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
  }>;
};

const Section = styled.section`
  padding: ${doubleSpacer} 0;
  text-align: center;
  background-color: ${(props: { backgroundColor?: string; inverse?: boolean }) =>
    props.backgroundColor};
  position: relative;
  color: ${(props) => (props.inverse ? white : textColor)};

  @media only screen and (min-width: ${breakpoints.sm}) {
    padding: ${quadrupleSpacer} 0;
    text-align: left;
  }
`;

const ParallaxBackground = styled.div`
  background: ${(props: { bgImage: string }) => `url("${props.bgImage}")`};
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center center;
  background-size: cover;
  height: 300px;
`;

const TypewriterWrapper = styled.div`
  & .Typewriter {
    display: block;
  }

  @media only screen and (min-width: ${breakpoints.md}) {
    & .Typewriter {
      display: inline-block;
    }
  }
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

const SectionImage = styled.img`
  max-height: 300px;
  margin-bottom: ${doubleSpacer};

  @media only screen and (min-width: ${breakpoints.sm}) {
    max-height: 800px;
  }
`;

const CarouselWrapper = styled.div`
  & .carousel-indicators li {
    background-color: ${textColor};
  }
`;

export const IndexPageTemplate: FunctionComponent<IndexPageProps> = (props) => {
  const [response, setResponse] = useState({ msg: '', result: '' });
  const size = useWindowSize();
  const isLargeScreen = Boolean(size && size.width && size.width > screenSizes.large);
  const initialValues = { fname: '', lname: '', email: '' };

  const getTextFromHtmlString = (s: string) => s.replace(/<.*?>*<\/.*?>/g, '');
  const getHrefFromHtmlString = (s: string) => s.match(/href="([^"]*)/)?.[1];
  const getLinkTextFromHtmlString = (s: string) => s.replace(/.*<.*?>(.*)<\/.*?>/g, '$1');
  const error = response.result === 'error';

  return (
    <>
      <Seo title={props.title} />
      <HeroImage
        imgSrc={props.heroImage.childImageSharp.fluid.src}
        mobileImgSrc={props.mobileHeroImage.childImageSharp.fluid.src}
      >
        <PageContainer>
          <Heading inverse align="center" noMargin>
            <TypewriterWrapper>
              Never forget your{' '}
              <Typewriter
                options={{
                  strings: props.typewriterList.map((arr) => arr.text),
                  autoStart: true,
                  loop: true,
                }}
              />{' '}
              again
            </TypewriterWrapper>
          </Heading>

          <p>{props.heroSubheading}</p>
          <Button type="button" onClick={() => scrollTo(props.heroCTALink)}>
            {props.heroCTAText}
          </Button>
        </PageContainer>
      </HeroImage>
      <Section backgroundColor={brandPrimary} id="learn-more" inverse>
        <PageContainer>
          <Heading as="h1" align="center" inverse noMargin>
            {props.mainpitch.heading}
          </Heading>
        </PageContainer>
      </Section>
      <Section backgroundColor={white}>
        <PageContainer>
          <Row>
            <Column sm={6}>
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
            <Column sm={6} md={3} mdOffset={2}>
              <SectionImage src={props.mainpitch.image.childImageSharp.fluid.src} alt="" />
            </Column>
          </Row>
        </PageContainer>
      </Section>
      <Section backgroundColor={brandSecondary} inverse>
        <WavesAnimation wave={waveDownriver} />
        <PageContainer>
          <Row>
            <Column sm={6} xsOrder={2} smOrder={1}>
              <SectionImage src={props.secondpitch.image.childImageSharp.fluid.src} alt="" />
            </Column>
            <Column sm={6} xsOrder={1} smOrder={2}>
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
        <WavesAnimation wave={waveBismark} />
        <PageContainer>
          <Row>
            <Column sm={6}>
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
            <Column sm={6} md={3} mdOffset={2}>
              <SectionImage src={props.thirdpitch.image.childImageSharp.fluid.src} alt="" />
            </Column>
          </Row>
        </PageContainer>
      </Section>
      {isLargeScreen && <ParallaxBackground bgImage={collage} />}
      <Section
        backgroundColor={white}
        id="signup"
        style={{
          backgroundImage: `url("${props.signupform.bgImage.childImageSharp.fluid.src}")`,
          backgroundSize: 500,
        }}
      >
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
                        <Column sm={6}>
                          <Field
                            as={Input}
                            type="text"
                            name="fname"
                            label="First Name"
                            required
                            validate={requiredField}
                          />
                        </Column>
                        <Column sm={6}>
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
              </Box>
            </Column>
          </Row>
        </PageContainer>
      </Section>
      <div style={{ backgroundColor: lightestGray, padding: `${doubleSpacer} 0` }}>
        <PageContainer>
          <Heading align="center">Word on the trail about packup</Heading>
          <CarouselWrapper>
            <Carousel
              fade
              nextIcon={<FaChevronRight color={textColor} />}
              prevIcon={<FaChevronLeft color={textColor} />}
            >
              {props.testimonials.map((testimonial) => (
                <Carousel.Item key={testimonial.author}>
                  <Testimonial testimonial={testimonial} />
                </Carousel.Item>
              ))}
            </Carousel>
          </CarouselWrapper>
        </PageContainer>
      </div>
    </>
  );
};

const IndexPage = ({ data }: { data: { markdownRemark: { frontmatter: IndexPageProps } } }) => {
  const { frontmatter } = data.markdownRemark;
  return (
    <IndexPageTemplate
      heroImage={frontmatter.heroImage}
      mobileHeroImage={frontmatter.mobileHeroImage}
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
      testimonials={frontmatter.testimonials}
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
        mobileHeroImage {
          childImageSharp {
            fluid(maxWidth: 768, quality: 100) {
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
              fluid(maxWidth: 1000, quality: 100) {
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
              fluid(maxWidth: 1000, quality: 100) {
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
              fluid(maxWidth: 1000, quality: 100) {
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
              fluid(maxWidth: 1000, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        testimonials {
          quote
          author
          location
          avatar {
            childImageSharp {
              fluid(maxWidth: 300, quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`;
