import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';

import { Box, PageContainer, Seo, HeroImage, Heading, Content, HTMLContent } from '@components';
import { FluidImageType } from '@common/image';

type AboutPageProps = {
  hideFromCms?: boolean;
  title: string;
  content: any;
  contentComponent: typeof HTMLContent;
  heroImage: FluidImageType;
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
  data: {
    markdownRemark: {
      frontmatter: AboutPageProps;
      html: any;
      heroImage: AboutPageProps['heroImage'];
    };
  };
}) => {
  const { markdownRemark: post } = data;

  return (
    <AboutPageTemplate
      contentComponent={HTMLContent}
      title={post.frontmatter.title}
      heroImage={post.heroImage}
      content={post.html}
    />
  );
};

export default AboutPage;

export const aboutPageQuery = graphql`
  query AboutPage {
    markdownRemark(frontmatter: { templateKey: { eq: "about-page" } }) {
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
