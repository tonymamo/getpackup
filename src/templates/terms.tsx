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

type TermsProps = {
  hideFromCms?: boolean;
  title: string;
  content: any;
  contentComponent: typeof HTMLContent;
  heroImage: { childImageSharp: { fluid: FluidObject } };
};

export const TermsTemplate: FunctionComponent<TermsProps> = ({
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

const Terms = ({ data }: { data: { markdownRemark: { frontmatter: TermsProps; html: any } } }) => {
  const { markdownRemark: post } = data;

  return (
    <TermsTemplate
      contentComponent={HTMLContent}
      title={post.frontmatter.title}
      heroImage={post.frontmatter.heroImage}
      content={post.html}
    />
  );
};

export default Terms;

export const termsQuery = graphql`
  query TermsPage {
    markdownRemark(frontmatter: { templateKey: { eq: "terms" } }) {
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
