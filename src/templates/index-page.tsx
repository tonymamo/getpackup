import React, { FunctionComponent } from 'react';
import { navigate, graphql } from 'gatsby';
import Typewriter from 'typewriter-effect';
import styled, { keyframes } from 'styled-components';
import Carousel from 'react-bootstrap/Carousel';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import {
  Seo,
  HeroImage,
  Button,
  PageContainer,
  Row,
  Column,
  Heading,
  FlexContainer,
  Testimonial,
  ClientOnly,
  PreviewCompatibleImage,
  LoadingPage,
  BlogRoll,
} from '@components';
import {
  textColor,
  white,
  brandPrimary,
  brandSecondary,
  brandTertiary,
  lightestGray,
} from '@styles/color';
import { quadrupleSpacer, breakpoints, doubleSpacer, baseSpacer } from '@styles/size';
import collage from '@images/Outdoorsman_Collage copy.jpg';
import waveBismark from '@images/wave-bismark.svg';
import waveDownriver from '@images/wave-downriver.svg';
import useWindowSize from '@utils/useWindowSize';
import { RootState } from '@redux/ducks';
import { FluidImageType } from '@common/image';
import { BlogRollType } from '@common/blogRoll';

type IndexPageProps = {
  hideFromCms?: boolean;
  title: string;
  heroHeading: string;
  typewriterList: Array<{ text: string }>;
  heroSubheading: string;
  heroCTALink: string;
  heroCTAText: string;
  heroImage: FluidImageType;
  mobileHeroImage: FluidImageType;
  mainpitchImage: FluidImageType;
  secondpitchImage: FluidImageType;
  thirdpitchImage: FluidImageType;
  mainpitch: {
    heading: string;
    subheading: string;
    text: string;
    image: FluidImageType;
  };
  secondpitch: {
    heading: string;
    subheading: string;
    text: string;
    image: FluidImageType;
  };
  thirdpitch: {
    heading: string;
    subheading: string;
    text: string;
    image: FluidImageType;
  };
  testimonials: Array<{
    quote: string;
    author: string;
    location: string;
    avatar: FluidImageType;
  }>;
  pageContext: {
    currentPage: number;
    limit: number;
    numPages: number;
    skip: number;
  };
  posts: BlogRollType;
};

const Section = styled.section`
  padding: ${doubleSpacer} 0;
  text-align: center;
  background-color: ${(props: { backgroundColor?: string; inverse?: boolean }) =>
    props.backgroundColor};
  position: relative;
  color: ${(props) => (props.inverse ? white : textColor)};

  & h3:after {
    content: '';
    border-bottom: 2px solid ${brandPrimary};
    width: 80%;
    margin: ${baseSpacer} auto;
    display: block;
  }

  @media only screen and (min-width: ${breakpoints.sm}) {
    padding: ${quadrupleSpacer} 0;
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

const SectionImageWrapper = styled.div`
  max-height: 450px;
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
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const size = useWindowSize();

  if (!!auth && auth.isLoaded && !auth.isEmpty) {
    navigate('/app/trips');
  }

  if (!auth.isLoaded) {
    return <LoadingPage />;
  }

  return (
    <>
      {!props.hideFromCms && <Seo title={props.title} />}
      <HeroImage imgSrc={props.heroImage} mobileImgSrc={props.mobileHeroImage}>
        <PageContainer>
          <Heading inverse align="center" noMargin>
            <TypewriterWrapper>
              Never forget your{' '}
              <Typewriter
                onInit={() => {}}
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
          <Button type="link" to={props.heroCTALink}>
            {props.heroCTAText}
          </Button>
        </PageContainer>
      </HeroImage>
      <Section backgroundColor={brandPrimary} id="learn-more" inverse>
        <PageContainer>
          <Heading as="h2" align="center" inverse noMargin>
            {props.mainpitch.heading}
          </Heading>
        </PageContainer>
      </Section>
      <Section backgroundColor={white}>
        <PageContainer>
          <Row>
            <Column sm={6}>
              <FlexContainer flexDirection="column" justifyContent="center" height="100%">
                <Heading as="h3">{props.mainpitch.subheading}</Heading>
                <p>{props.mainpitch.text}</p>
              </FlexContainer>
            </Column>
            <Column xs={6} xsOffset={3} sm={4} smOffset={1} md={3} mdOffset={2}>
              <SectionImageWrapper>
                <PreviewCompatibleImage
                  imageInfo={{
                    image: props.mainpitchImage,
                    alt: 'mockup of packup app on iphone',
                  }}
                />
              </SectionImageWrapper>
            </Column>
          </Row>
        </PageContainer>
      </Section>
      <Section backgroundColor={brandSecondary} inverse>
        <WavesAnimation wave={waveDownriver} />
        <PageContainer>
          <Row>
            <Column sm={6} xsOrder={2} smOrder={1}>
              <SectionImageWrapper>
                <PreviewCompatibleImage
                  imageInfo={{
                    image: props.secondpitchImage,
                    alt: 'mockup of packup app on iphone',
                  }}
                />
              </SectionImageWrapper>
            </Column>
            <Column sm={6} xsOrder={1} smOrder={2}>
              <FlexContainer flexDirection="column" justifyContent="center" height="100%">
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
              <FlexContainer flexDirection="column" justifyContent="center" height="100%">
                <Heading as="h3" inverse>
                  {props.thirdpitch.subheading}
                </Heading>
                <p>{props.thirdpitch.text}</p>
              </FlexContainer>
            </Column>
            <Column sm={6}>
              <SectionImageWrapper>
                <PreviewCompatibleImage
                  imageInfo={{
                    image: props.thirdpitchImage,
                    alt: 'mockup of packup app on iphone',
                  }}
                />
              </SectionImageWrapper>
            </Column>
          </Row>
        </PageContainer>
      </Section>
      {size.isLargeScreen && (
        <ClientOnly>
          <ParallaxBackground bgImage={collage} />
        </ClientOnly>
      )}
      <Section backgroundColor={lightestGray}>
        <PageContainer>
          <Row>
            <Column xs={6} xsOffset={3}>
              <Heading align="center" as="h3">
                Word on the trail about packup
              </Heading>
            </Column>
          </Row>
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
      </Section>
      <Section>
        <PageContainer>
          <Row>
            <Column xs={6} xsOffset={3}>
              <Heading as="h3" align="center">
                Latest Stories
              </Heading>
            </Column>
          </Row>
          <BlogRoll posts={props.posts} />
          <Button type="link" to="/blog/2" iconRight={<FaChevronRight />} color="secondary">
            See More
          </Button>
        </PageContainer>
      </Section>
    </>
  );
};

const IndexPage = ({
  data,
  pageContext,
}: {
  pageContext: IndexPageProps['pageContext'];
  data: {
    allMarkdownRemark: {
      edges: IndexPageProps['posts'];
    };
    markdownRemark: {
      frontmatter: IndexPageProps;
      heroImage: IndexPageProps['heroImage'];
      mobileHeroImage: IndexPageProps['mobileHeroImage'];
      mainpitchImage: IndexPageProps['mainpitchImage'];
      secondpitchImage: IndexPageProps['secondpitchImage'];
      thirdpitchImage: IndexPageProps['thirdpitchImage'];
    };
  };
}) => {
  const { markdownRemark: post, allMarkdownRemark: all } = data;

  return (
    <IndexPageTemplate
      heroImage={post.heroImage}
      mobileHeroImage={post.mobileHeroImage}
      mainpitchImage={post.mainpitchImage}
      secondpitchImage={post.secondpitchImage}
      thirdpitchImage={post.thirdpitchImage}
      title={post.frontmatter.title}
      heroHeading={post.frontmatter.heroHeading}
      typewriterList={post.frontmatter.typewriterList}
      heroSubheading={post.frontmatter.heroSubheading}
      heroCTALink={post.frontmatter.heroCTALink}
      heroCTAText={post.frontmatter.heroCTAText}
      mainpitch={post.frontmatter.mainpitch}
      secondpitch={post.frontmatter.secondpitch}
      thirdpitch={post.frontmatter.thirdpitch}
      testimonials={post.frontmatter.testimonials}
      pageContext={pageContext}
      posts={all.edges}
    />
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPageTemplate {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 6
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
            readingTime {
              text
            }
          }
          featuredimage {
            fluid(maxWidth: 400) {
              ...CloudinaryAssetFluid
            }
          }
          frontmatter {
            title
            templateKey
            description
            date(formatString: "MMMM DD, YYYY")
            featuredpost
          }
        }
      }
    }
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      heroImage {
        fluid {
          base64
          ...CloudinaryAssetFluid
        }
      }
      mobileHeroImage {
        fluid {
          base64
          ...CloudinaryAssetFluid
        }
      }
      mainpitchImage {
        fluid {
          base64
          ...CloudinaryAssetFluid
        }
      }
      secondpitchImage {
        fluid {
          base64
          ...CloudinaryAssetFluid
        }
      }
      thirdpitchImage {
        fluid {
          base64
          ...CloudinaryAssetFluid
        }
      }
      frontmatter {
        title
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
          image
        }
        secondpitch {
          heading
          subheading
          text
          image
        }
        thirdpitch {
          heading
          subheading
          text
          image
        }
        testimonials {
          quote
          author
          location
          avatar
        }
      }
    }
  }
`;
