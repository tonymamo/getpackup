import { BlogRollType } from '@common/blogRoll';
import { FluidImageType } from '@common/image';
import {
  BlogRoll,
  Button,
  FlexContainer,
  Heading,
  HeroImage,
  PageContainer,
  Seo,
} from '@components';
import trackEvent from '@utils/trackEvent';
import { graphql } from 'gatsby';
import React, { FunctionComponent } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type BlogIndexProps = {
  title: string;
  heroImage: FluidImageType;
  pageContext: {
    currentPage: number;
    limit: number;
    numPages: number;
    skip: number;
  };
  posts: BlogRollType;
};

export const BlogIndexTemplate: FunctionComponent<BlogIndexProps> = (props) => {
  const { currentPage, numPages } = props.pageContext;
  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;
  const prevPage = currentPage - 1 === 1 ? '' : (currentPage - 1).toString();
  const nextPage = (currentPage + 1).toString();
  return (
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
        <section>
          <BlogRoll posts={props.posts} />
          <FlexContainer justifyContent="space-between">
            {!isFirst ? (
              <Button
                type="link"
                color="secondary"
                to={`/blog/${prevPage}`}
                iconLeft={<FaChevronLeft />}
                onClick={() => trackEvent('Blog Index Previous Page Clicked')}
              >
                Previous
              </Button>
            ) : (
              <div />
            )}
            {!isLast ? (
              <Button
                type="link"
                color="secondary"
                to={`/blog/${nextPage}`}
                iconRight={<FaChevronRight />}
                onClick={() => trackEvent('Blog Index Next Page Clicked')}
              >
                Next
              </Button>
            ) : (
              <div />
            )}
          </FlexContainer>
        </section>
      </PageContainer>
    </>
  );
};

const BlogIndexPage = ({
  data,
  pageContext,
}: {
  pageContext: BlogIndexProps['pageContext'];
  data: {
    allMarkdownRemark: {
      edges: BlogRollType;
    };
    markdownRemark: {
      frontmatter: BlogIndexProps;
      html: any;
      heroImage: BlogIndexProps['heroImage'];
    };
  };
}) => {
  const { markdownRemark: post, allMarkdownRemark: all } = data;
  return (
    <BlogIndexTemplate
      title={post.frontmatter.title}
      heroImage={post.heroImage}
      pageContext={pageContext}
      posts={all.edges}
    />
  );
};

export default BlogIndexPage;

export const blogIndexPageQuery = graphql`
  query BlogIndexPage($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { order: [DESC, DESC], fields: [frontmatter___featuredpost, frontmatter___date] }
      limit: $limit
      skip: $skip
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
            readingTime {
              text
            }
          }
          featuredimage {
            fluid(maxWidth: 400) {
              ...CloudinaryAssetFluid
            }
          }
          frontmatter {
            title
            templateKey
            description
            date(formatString: "MMMM DD, YYYY")
            featuredpost
          }
        }
      }
    }
    markdownRemark(frontmatter: { templateKey: { eq: "blog-index-page" } }) {
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
