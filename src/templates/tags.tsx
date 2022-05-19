import { FluidImageType } from '@common/image';
import { Box, Heading, HeroImage, PageContainer, Seo } from '@components';
import { Link, graphql } from 'gatsby';
import React, { FunctionComponent } from 'react';

type TagRouteProps = {
  data: {
    markdownRemark: {
      heroImage: FluidImageType;
    };
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
  const { totalCount } = data.allMarkdownRemark;
  const tagHeader = `${totalCount} post${totalCount === 1 ? '' : 's'} tagged with “${tag}”`;

  return (
    <>
      <HeroImage imgSrc={data.markdownRemark.heroImage}>
        <PageContainer>
          <Heading as="h1" inverse align="center">
            Posts tagged {tag}
          </Heading>
        </PageContainer>
      </HeroImage>
      <PageContainer withVerticalPadding>
        <Seo title={`Posts tagged ${tag}`} />
        <Box>
          <Heading>{tagHeader}</Heading>
          <ul>{postLinks}</ul>
          <p>
            <Link to="/tags/">Browse all tags</Link>
          </p>
        </Box>
      </PageContainer>
    </>
  );
};

export default TagRoute;

export const tagPageQuery = graphql`
  query TagPage($tag: String) {
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
    markdownRemark(frontmatter: { templateKey: { eq: "tags-index-page" } }) {
      heroImage {
        fluid {
          base64
          ...CloudinaryAssetFluid
        }
      }
    }
  }
`;
