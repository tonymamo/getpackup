import { BlogRollType } from '@common/blogRoll';
import { FluidImageType } from '@common/image';
import {
  Badges,
  Button,
  Column,
  Dividers,
  FlexContainer,
  Heading,
  HeroImage,
  PageContainer,
  Row,
  Seo,
} from '@components';
import devices from '@images/devices.png';
import mountainScene from '@images/mountain-scene.png';
import route from '@images/route.svg';
import screenshot1 from '@images/screenshot-1.png';
import screenshot2 from '@images/screenshot-2.png';
import screenshot3 from '@images/screenshot-5.png';
import TopoBg from '@images/topo1';
// import loadable from '@loadable/component';
import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { RootState } from '@redux/ducks';
import { brandSecondary, offWhite, white } from '@styles/color';
import { visuallyHiddenStyle } from '@styles/mixins';
import { baseSpacer, breakpoints, halfSpacer, tripleSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import useWindowSize from '@utils/useWindowSize';
import { Link, graphql, navigate } from 'gatsby';
import React, { FunctionComponent, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Typewriter from 'typewriter-effect';

// const Testimonial = loadable(() => import('@components/Testimonial'), {
//   fallback: <InlineLoader />,
// });
// const BlogRoll = loadable(() => import('@components/BlogRoll'), { fallback: <InlineLoader /> });

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
  fourthpitchImage: FluidImageType;
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
  fourthpitch: {
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

const ParallaxWrapper = styled.div`
  height: 100vh;
`;

const Section = styled.section<{ background?: string }>`
  background-color: ${(props) => props.background || 'transparent'};
  position: relative;
  height: 100vh;
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

const BlurredBackgroundWrapper = styled.div<{ bgColor: string }>`
  & h2,
  & p {
    position: relative;
  }

  & p {
    font-size: 1.5rem;
    line-height: 1.5;
  }

  & h2:after,
  & p:after {
    content: '';
    position: absolute;
    inset: -${baseSpacer};
    filter: blur(${baseSpacer});
    background-color: ${(props) => props.bgColor};
    z-index: -1;
  }
`;

const Footer = styled.footer`
  color: ${white};
  width: 100%;
  & a {
    color: ${white};
    opacity: 0.8;

    &:hover,
    &:focus {
      color: ${white};
      opacity: 1;
    }
  }
`;

const Social = styled.a`
  margin-right: ${baseSpacer};
`;

const HiddenText = styled.span`
  ${visuallyHiddenStyle};
`;

export const IndexPageTemplate: FunctionComponent<IndexPageProps> = (props) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const { isSmallScreen } = useWindowSize();

  useEffect(() => {
    if (auth.isLoaded && !auth.isEmpty) {
      navigate('/app/trips');
    }
  }, [auth]);

  return (
    <>
      {!props.hideFromCms && <Seo title={props.title} />}

      {/* <Section background={white}>
        <Dividers>
          <Dividers.Divider1 fill={white} />
        </Dividers> */}
      {/* <PageContainer>
          <Row>
            <Column sm={6}>
              <FlexContainer flexDirection="column" justifyContent="center" height="100%">
                <Heading as="h2" mega>
                  {props.mainpitch.heading}
                </Heading>

                <p>{props.mainpitch.subheading}</p>
              </FlexContainer>
            </Column>
            <Column xs={6} xsOffset={3} sm={4} smOffset={1} md={6}> */}
      <ParallaxWrapper>
        <Parallax pages={6}>
          <ParallaxLayer offset={0}>
            <HeroImage imgSrc={props.heroImage} mobileImgSrc={props.mobileHeroImage} fullHeight>
              <PageContainer>
                <FlexContainer flexDirection="column" height="100vh">
                  <Heading inverse align="center" noMargin mega>
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

                  <p style={{ color: white, fontSize: '1.5rem', lineHeight: 1.5 }}>
                    {props.heroSubheading}
                  </p>

                  <div style={{ marginTop: tripleSpacer }}>
                    <Heading inverse align="center" as="h6" uppercase>
                      Now available on iOS, Android, and Web
                    </Heading>
                  </div>
                  <Badges />
                </FlexContainer>
              </PageContainer>
            </HeroImage>
          </ParallaxLayer>

          {[offWhite, '#eaeff8', '#d9e1ec', white, brandSecondary].map((item, index) => {
            const divider = () => {
              switch (index) {
                case 0:
                  return <Dividers.Divider1 fill={item} />;
                case 1:
                  return <Dividers.Divider2 fill={item} />;
                case 2:
                  return <Dividers.Divider3 fill={item} />;
                case 3:
                  return <Dividers.Divider4 fill={item} />;
                default:
                  return <Dividers.Divider1 fill={item} />;
              }
            };
            return (
              <ParallaxLayer offset={index + 1} key={item}>
                <Section background={item}>
                  <Dividers>{divider()}</Dividers>
                </Section>
              </ParallaxLayer>
            );
          })}

          {/* Page 2  */}
          <ParallaxLayer offset={1.1} speed={0.1}>
            <img
              src={route}
              alt=""
              style={{
                width: '50%',
                marginLeft: '25%',
              }}
            />
          </ParallaxLayer>

          <ParallaxLayer offset={1} speed={0.8}>
            <PageContainer>
              <img
                src={screenshot1}
                alt=""
                style={{
                  width: isSmallScreen ? '85%' : '40%',
                  marginLeft: isSmallScreen ? '10%' : '60%',
                }}
              />
            </PageContainer>
          </ParallaxLayer>

          {/* End Page 2 */}

          {/* Page 3 */}
          <ParallaxLayer offset={2} speed={0.75}>
            <PageContainer>
              <img
                src={screenshot2}
                alt=""
                style={{
                  width: isSmallScreen ? '85%' : '35%',
                  marginLeft: isSmallScreen ? '10%' : '60%',
                }}
              />
            </PageContainer>
          </ParallaxLayer>
          {/* End Page 3 */}

          {/* Page 4 */}
          <ParallaxLayer offset={2.75} speed={0.1}>
            <TopoBg
              style={{
                opacity: 0.25,
                width: '100%',
              }}
            />
          </ParallaxLayer>
          <ParallaxLayer offset={3.2} speed={0.5}>
            <PageContainer>
              <img
                src={screenshot3}
                alt=""
                style={{
                  width: isSmallScreen ? '80%' : '40%',
                  marginLeft: isSmallScreen ? '10%' : '55%',
                }}
              />
            </PageContainer>
          </ParallaxLayer>

          {/* End Page 4 */}

          {/* Page 5 */}
          <ParallaxLayer offset={4.2} speed={0.5}>
            <PageContainer>
              <img
                src={devices}
                alt=""
                style={{
                  width: isSmallScreen ? '100%' : '70%',
                  marginLeft: isSmallScreen ? '0%' : '45%',
                }}
              />
            </PageContainer>
          </ParallaxLayer>
          {/* End Page 5 */}

          {/* Text */}
          {[
            ['mainpitch', offWhite],
            ['secondpitch', '#eaeff8'],
            ['thirdpitch', '#d9e1ec'],
            ['fourthpitch', white],
          ].map((item, index) => {
            return (
              <ParallaxLayer offset={index + 1} key={item[0]}>
                <Section background="transparent">
                  <PageContainer>
                    <Row>
                      <Column md={6}>
                        <FlexContainer
                          flexDirection="column"
                          justifyContent="center"
                          height="100vh"
                          alignItems="flex-start"
                        >
                          <BlurredBackgroundWrapper bgColor={item[1]}>
                            <Heading as="h2" mega>
                              {props[item[0]].heading}
                            </Heading>

                            <p>{props[item[0]].subheading}</p>

                            {index === 3 && (
                              <>
                                <Badges />
                              </>
                            )}
                          </BlurredBackgroundWrapper>
                        </FlexContainer>
                      </Column>
                    </Row>
                  </PageContainer>
                </Section>
              </ParallaxLayer>
            );
          })}

          {/* Page 6 aka Footer */}
          <ParallaxLayer offset={5} speed={1}>
            <Section background="transparent">
              <FlexContainer
                justifyContent="space-evenly"
                flexDirection="column"
                height="100vh"
                alignItems="center"
              >
                <PageContainer>
                  <div style={{ textAlign: 'center' }}>
                    <Heading as="h1" inverse align="center">
                      Plan your first trip today
                    </Heading>

                    <Button type="link" to="https://packupapp.com/signup">
                      Get Started
                    </Button>
                  </div>
                </PageContainer>
                <PageContainer>
                  <Footer>
                    <Row>
                      <Column md={3} lg={6}>
                        <Heading>
                          <Link to="/">packup</Link>
                        </Heading>
                        <p>Get outside faster and safer.</p>
                        <nav>
                          <Social
                            href="https://www.instagram.com/getpackup/"
                            target="_blank"
                            rel="noopener"
                            onClick={() => trackEvent('Footer Link Click', { link: 'Instagram' })}
                          >
                            <FaInstagram />
                            <HiddenText>Instagram</HiddenText>
                          </Social>
                          <Social
                            href="https://www.facebook.com/getpackup"
                            target="_blank"
                            rel="noopener"
                            onClick={() => trackEvent('Footer Link Click', { link: 'Facebook' })}
                          >
                            <FaFacebook />
                            <HiddenText>Facebook</HiddenText>
                          </Social>
                          <Social
                            href="https://twitter.com/getpackup"
                            target="_blank"
                            rel="noopener"
                            onClick={() => trackEvent('Footer Link Click', { link: 'Twitter' })}
                          >
                            <FaTwitter />
                            <HiddenText>Twitter</HiddenText>
                          </Social>
                        </nav>
                        <small>
                          <Link
                            to="/privacy"
                            onClick={() => trackEvent('Footer Link Click', { link: 'Privacy' })}
                          >
                            Privacy
                          </Link>
                          {' | '}
                          <Link
                            to="/terms"
                            onClick={() =>
                              trackEvent('Footer Link Click', { link: 'Terms of Use' })
                            }
                          >
                            Terms of Use
                          </Link>
                          <br />
                          {`Copyright © Packup Technologies, Ltd. ${new Date().getFullYear()}`}
                        </small>
                      </Column>
                      <Column sm={4} md={3} lg={2}>
                        <p>
                          <Link
                            to="/"
                            onClick={() => trackEvent('Footer Link Click', { link: 'Home' })}
                          >
                            Home
                          </Link>
                        </p>
                        <p>
                          <Link
                            to="https://packupapp.com"
                            onClick={() => trackEvent('Footer Link Click', { link: 'Sign Up' })}
                          >
                            Sign Up
                          </Link>
                        </p>
                      </Column>
                      <Column sm={4} md={3} lg={2}>
                        <p>
                          <Link
                            to="/blog"
                            onClick={() => trackEvent('Footer Link Click', { link: 'Blog' })}
                          >
                            Blog
                          </Link>
                        </p>
                        <p>
                          <Link
                            to="/about"
                            onClick={() => trackEvent('Footer Link Click', { link: 'About' })}
                          >
                            About
                          </Link>
                        </p>
                      </Column>
                      <Column sm={4} md={3} lg={2}>
                        <p>
                          <Link
                            to="/contact"
                            onClick={() =>
                              trackEvent('Footer Link Click', { link: 'Send a message' })
                            }
                          >
                            Send a Message
                          </Link>
                        </p>
                        <p>
                          <a
                            href="https://reddit.com/r/packup"
                            onClick={() => trackEvent('Footer Link Click', { link: 'Reddit' })}
                          >
                            Community
                          </a>
                        </p>
                      </Column>
                    </Row>
                    <div style={{ marginTop: tripleSpacer }}>
                      <Badges />
                    </div>
                  </Footer>
                </PageContainer>
              </FlexContainer>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundImage: `url(${mountainScene})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100%',
                  backgroundPosition: 'bottom center',
                  padding: halfSpacer,
                  display: 'flex',
                  alignItems: 'flex-end',
                  height: '100vh',
                  zIndex: -1,
                }}
              />
            </Section>
          </ParallaxLayer>
        </Parallax>
      </ParallaxWrapper>

      {/* <CarouselWrapper>
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
          </CarouselWrapper> */}

      {/* <Section background={offWhite}>
        <Dividers>
          <Dividers.Divider2 fill={offWhite} />
        </Dividers>
        <PageContainer>
          <Row>
            <Column xs={6} xsOffset={3}>
              <Heading as="h3" align="center">
                Latest Stories
              </Heading>
            </Column>
          </Row>
          <BlogRoll posts={props.posts} />
          <Button
            type="link"
            to="/blog/2"
            iconRight={<FaChevronRight />}
            color="secondary"
            onClick={() => trackEvent('Index Page Blog Previous Post Button Clicked')}
          >
            Previous Posts
          </Button>
        </PageContainer>
      </Section> */}
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
      fourthpitchImage: IndexPageProps['fourthpitchImage'];
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
      fourthpitchImage={post.fourthpitchImage}
      title={post.frontmatter.title}
      heroHeading={post.frontmatter.heroHeading}
      typewriterList={post.frontmatter.typewriterList}
      heroSubheading={post.frontmatter.heroSubheading}
      heroCTALink={post.frontmatter.heroCTALink}
      heroCTAText={post.frontmatter.heroCTAText}
      mainpitch={post.frontmatter.mainpitch}
      secondpitch={post.frontmatter.secondpitch}
      thirdpitch={post.frontmatter.thirdpitch}
      fourthpitch={post.frontmatter.fourthpitch}
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
      sort: { order: [DESC, DESC], fields: [frontmatter___featuredpost, frontmatter___date] }
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
      fourthpitchImage {
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
        fourthpitch {
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
