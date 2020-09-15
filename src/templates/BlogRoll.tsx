/* eslint-disable react/display-name */
import React, { FunctionComponent } from 'react';
import { Link, graphql, StaticQuery } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import { Box, HorizontalRule, Heading, Row, Column, PreviewCompatibleImage } from '../components';

type BlogRollProps = {
  data: {
    allMarkdownRemark: {
      id: number;
      fields: {
        slug: string;
        readingTime: {
          text: string;
        };
      };
      date: string;
      description: string;
      excerpt: string;
      edges: Array<{
        frontmatter: {
          featuredimage: {
            childImageSharp: {
              fluid: FluidObject;
            };
          };
          title: string;
        };
      }>;
    };
  };
  count: number;
};

const BlogRoll: FunctionComponent<BlogRollProps> = ({ data, count }) => {
  const { edges: posts } = data.allMarkdownRemark;

  return (
    <Row>
      {posts &&
        posts.slice(0, count).map(({ node: post }: any) => (
          <Column md={4} key={post.id}>
            <Box>
              {post.frontmatter.featuredimage && (
                <Link to={post.fields.slug}>
                  <PreviewCompatibleImage
                    imageInfo={{
                      image: post.frontmatter.featuredimage,
                      alt: `featured image thumbnail for post ${post.frontmatter.title}`,
                    }}
                  />
                </Link>
              )}
              <small>
                {post.frontmatter.date} - {post.fields.readingTime.text}
              </small>
              <Heading as="h2" noMargin>
                <Link className="title has-text-primary is-size-4" to={post.fields.slug}>
                  {post.frontmatter.title}
                </Link>
              </Heading>
              <HorizontalRule compact />

              <small style={{ fontStyle: 'italic' }}>{post.frontmatter.description}</small>
            </Box>
          </Column>
        ))}
    </Row>
  );
};

// eslint-disable-next-line react/require-default-props
export default (props: { count?: number }) => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
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
              frontmatter {
                title
                templateKey
                description
                date(formatString: "MMMM DD, YYYY")
                featuredpost
                featuredimage {
                  childImageSharp {
                    fluid(maxWidth: 400, quality: 60) {
                      ...GatsbyImageSharpFluid_withWebp
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={(data: any) => (
      <BlogRoll data={data} count={props.count || data.allMarkdownRemark.edges.length} />
    )}
  />
);
