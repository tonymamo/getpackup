import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import {
  Box,
  PageContainer,
  Seo,
  HeroImage,
  Heading,
  Content,
  HTMLContent,
  Row,
  Column,
} from '@components';

type PrivacyProps = {
  hideFromCms?: boolean;
  title: string;
  content: any;
  contentComponent: typeof HTMLContent;
  heroImage: { childImageSharp: { fluid: FluidObject } };
};

export const PrivacyTemplate: FunctionComponent<PrivacyProps> = ({
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
          <Row>
            <Column md={8} mdOffset={2}>
              <Heading>{title}</Heading>
              <div>
                <PageContent content={content} />
              </div>
            </Column>
          </Row>
        </Box>
      </PageContainer>
    </>
  );
};

const Privacy = ({
  data,
}: {
  data: { markdownRemark: { frontmatter: PrivacyProps; html: any } };
}) => {
  const { markdownRemark: post } = data;

  return (
    <PrivacyTemplate
      contentComponent={HTMLContent}
      title={post.frontmatter.title}
      heroImage={post.frontmatter.heroImage}
      content={post.html}
    />
  );
};

export default Privacy;

export const privacyQuery = graphql`
  query PrivacyPage {
    markdownRemark(frontmatter: { templateKey: { eq: "privacy" } }) {
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
