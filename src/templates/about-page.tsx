import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';

import Content, { HTMLContent } from '../components/Content';
import { Box, PageContainer, Seo, HeroImage, Heading } from '../components';
import image from '../images/Mountains_Day.jpg';

type AboutPageProps = {
  title: string;
  content: any;
  contentComponent: typeof HTMLContent;
};

export const AboutPageTemplate: FunctionComponent<AboutPageProps> = ({
  title,
  content,
  contentComponent,
}) => {
  const PageContent = contentComponent || Content;

  return (
    <>
      <HeroImage imgSrc={image}>
        <PageContainer>
          <Heading as="h1" inverse align="center">
            {title}
          </Heading>
        </PageContainer>
      </HeroImage>
      <PageContainer withVerticalPadding>
        <Seo title={title} />
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
      }
    }
  }
`;
