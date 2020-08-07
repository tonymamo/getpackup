import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, graphql } from 'gatsby';

import { PageContainer } from '../components';

type TagRouteProps = {
  data: {
    allMarkdownRemark: {
      totalCount: number;
      edges: Array<{
        node: {
          frontmatter: {
            title: string;
          };
          fields: {
            slug: string;
          };
        };
      }>;
    };
    site: {
      siteMetadata: {
        title: string;
      };
    };
  };
  pageContext: {
    tag: string;
  };
};

const TagRoute: FunctionComponent<TagRouteProps> = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.edges;
  const postLinks = posts.map((post: any) => (
    <li key={post.node.fields.slug}>
      <Link to={post.node.fields.slug}>{post.node.frontmatter.title}</Link>
    </li>
  ));
  const { tag } = pageContext;
  const { title } = data.site.siteMetadata;
  const { totalCount } = data.allMarkdownRemark;
  const tagHeader = `${totalCount} post${totalCount === 1 ? '' : 's'} tagged with “${tag}”`;

  return (
    <PageContainer>
      <Helmet title={`${tag} | ${title}`} />
      <div>
        <h1>{tagHeader}</h1>
        <ul>{postLinks}</ul>
        <p>
          <Link to="/tags/">Browse all tags</Link>
        </p>
      </div>
    </PageContainer>
  );
};

export default TagRoute;

export const tagPageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
