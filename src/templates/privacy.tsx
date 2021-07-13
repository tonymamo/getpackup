import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';

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
import { FluidImageType } from '@common/image';

type PrivacyProps = {
  hideFromCms?: boolean;
  title: string;
  content: any;
  contentComponent: typeof HTMLContent;
  heroImage: FluidImageType;
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
  data: {
    markdownRemark: { frontmatter: PrivacyProps; html: any; heroImage: PrivacyProps['heroImage'] };
  };
}) => {
  const { markdownRemark: post } = data;

  return (
    <PrivacyTemplate
      contentComponent={HTMLContent}
      title={post.frontmatter.title}
      heroImage={post.heroImage}
      content={post.html}
    />
  );
};

export default Privacy;

export const privacyQuery = graphql`
  query PrivacyPage {
    markdownRemark(frontmatter: { templateKey: { eq: "privacy" } }) {
      html
      heroImage {
        fluid {
          base64
          ...CloudinaryAssetFluid
        }
      }
      frontmatter {
        title
      }
    }
  }
`;
