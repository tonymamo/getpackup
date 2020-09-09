import React from 'react';
import { kebabCase } from 'lodash';
import { Link, graphql } from 'gatsby';

import { PageContainer, Box, Heading, Seo, HeroImage } from '../../components';
import image from '../../images/BrightSunnySnowyMountainsWtih3Hikers.jpg';

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
  },
}: {
  data: any;
}) => (
  <>
    <HeroImage imgSrc={image}>
      <PageContainer>
        <Heading as="h1" inverse align="center">
          Browse All Tags
        </Heading>
      </PageContainer>
    </HeroImage>
    <PageContainer withVerticalPadding>
      <Seo title="Browse all Tags" />
      <Box>
        <Heading>Tags</Heading>
        <ul>
          {group.map((tag: any) => (
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

export default TagsPage;

export const tagPageQuery = graphql`
  query TagsQuery {
    allMarkdownRemark(limit: 1000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
