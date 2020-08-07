import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import { Seo } from '../components';

type IndexPageProps = {
  title: string;
  heroHeading: string;
  heroSubheading: string;
  heroCTALink: string;
  heroCTAText: string;
  heroImage: { childImageSharp: { fluid: FluidObject } };
  mainpitch: {
    title: string;
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

export const IndexPageTemplate: FunctionComponent<IndexPageProps> = ({ title }) => (
  <div>
    <Seo title={title} />
  </div>
);

const IndexPage = ({ data }: { data: { markdownRemark: { frontmatter: IndexPageProps } } }) => {
  const { frontmatter } = data.markdownRemark;
  return (
    <IndexPageTemplate
      heroImage={frontmatter.heroImage}
      title={frontmatter.title}
      heroHeading={frontmatter.heroHeading}
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
        heroSubheading
        heroCTALink
        heroCTAText
        mainpitch {
          title
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
