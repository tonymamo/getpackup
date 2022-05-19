import { FluidImageType } from '@common/image';
import {
  Box,
  Column,
  Content,
  HTMLContent,
  Heading,
  HeroImage,
  PageContainer,
  Row,
  Seo,
} from '@components';
import { graphql } from 'gatsby';
import React, { FunctionComponent } from 'react';

type TermsProps = {
  hideFromCms?: boolean;
  title: string;
  content: any;
  contentComponent: typeof HTMLContent;
  heroImage: FluidImageType;
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

const Terms = ({
  data,
}: {
  data: {
    markdownRemark: { frontmatter: TermsProps; html: any; heroImage: TermsProps['heroImage'] };
  };
}) => {
  const { markdownRemark: post } = data;

  return (
    <TermsTemplate
      contentComponent={HTMLContent}
      title={post.frontmatter.title}
      heroImage={post.heroImage}
      content={post.html}
    />
  );
};

export default Terms;

export const termsQuery = graphql`
  query TermsPage {
    markdownRemark(frontmatter: { templateKey: { eq: "terms" } }) {
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
