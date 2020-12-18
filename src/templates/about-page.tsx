import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import { Box, PageContainer, Seo, HeroImage, Heading, Content, HTMLContent } from '@components';

type AboutPageProps = {
  hideFromCms?: boolean;
  title: string;
  content: any;
  contentComponent: typeof HTMLContent;
  heroImage: { childImageSharp: { fluid: FluidObject } };
};

export const AboutPageTemplate: FunctionComponent<AboutPageProps> = ({
  title,
  content,
  contentComponent,
  heroImage,
  hideFromCms,
}) => {
  const PageContent = contentComponent || Content;

  return (
    <>
      <HeroImage imgSrc={heroImage}>
        <PageContainer>
          <Heading as="h1" inverse align="center">
            {title}
          </Heading>
        </PageContainer>
      </HeroImage>
      <PageContainer withVerticalPadding>
        {!hideFromCms && <Seo title={title} />}
        <Box>
          <Heading>{title}</Heading>
          <div>
            <PageContent content={content} />
          </div>
        </Box>
      </PageContainer>
    </>
  );
};

const AboutPage = ({
  data,
}: {
  data: { markdownRemark: { frontmatter: AboutPageProps; html: any } };
}) => {
  const { markdownRemark: post } = data;

  return (
    <AboutPageTemplate
      contentComponent={HTMLContent}
      title={post.frontmatter.title}
      heroImage={post.frontmatter.heroImage}
      content={post.html}
    />
  );
};

export default AboutPage;

export const aboutPageQuery = graphql`
  query AboutPage {
    markdownRemark(frontmatter: { templateKey: { eq: "about-page" } }) {
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
