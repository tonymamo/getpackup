import React from 'react';
import { kebabCase } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { Link, graphql } from 'gatsby';

import { PageContainer } from '../../components';

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
}: {
  data: any;
}) => (
  <PageContainer>
    <Helmet title={`Tags | ${title}`} />
    <div>
      <h1>Tags</h1>
      <ul>
        {group.map((tag: any) => (
          <li key={tag.fieldValue}>
            <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
              {tag.fieldValue} {`(${tag.totalCount})`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </PageContainer>
);

export default TagsPage;

export const tagPageQuery = graphql`
  query TagsQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 1000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
