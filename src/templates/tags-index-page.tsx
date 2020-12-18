import React, { FunctionComponent } from 'react';
import { kebabCase } from 'lodash';
import { Link, graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import { PageContainer, Box, Heading, Seo, HeroImage } from '@components';

type TagsIndexProps = {
  title: string;
  group: Array<{ fieldValue: string; totalCount: number }>;
  heroImage: { childImageSharp: { fluid: FluidObject } };
};

export const TagsIndexTemplate: FunctionComponent<TagsIndexProps> = (props) => (
  <>
    <Seo title={props.title} />
    <HeroImage imgSrc={props.heroImage}>
      <PageContainer>
        <Heading as="h1" inverse align="center">
          {props.title}
        </Heading>
      </PageContainer>
    </HeroImage>
    <PageContainer withVerticalPadding>
      <Box>
        <Heading>Tags</Heading>
        <ul>
          {props.group.map((tag: any) => (
            <li key={tag.fieldValue}>
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                {tag.fieldValue} {`(${tag.totalCount})`}
              </Link>
            </li>
          ))}
        </ul>
      </Box>
    </PageContainer>
  </>
);

const TagsIndexPage = ({
  data,
}: {
  data: {
    markdownRemark: { frontmatter: TagsIndexProps };
    allMarkdownRemark: { group: Array<{ fieldValue: string; totalCount: number }> };
  };
}) => {
  const { markdownRemark: post } = data;
  return (
    <TagsIndexTemplate
      title={post.frontmatter.title}
      heroImage={post.frontmatter.heroImage}
      group={data.allMarkdownRemark.group}
    />
  );
};

export default TagsIndexPage;

export const tagPageQuery = graphql`
  query TagsIndexPage {
    allMarkdownRemark(limit: 1000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
    markdownRemark(frontmatter: { templateKey: { eq: "tags-index-page" } }) {
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
