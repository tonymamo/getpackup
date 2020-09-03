import React, { FunctionComponent } from 'react';
import { kebabCase } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { graphql, Link } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import {
  HeroImage,
  PageContainer,
  Box,
  Row,
  Column,
  Heading,
  HorizontalRule,
  FlexContainer,
} from '../components';
import Content, { HTMLContent } from '../components/Content';
import { quadrupleSpacer } from '../styles/size';

type BlogPostProps = {
  content: any;
  contentComponent: any;
  date: string;
  tags: Array<string>;
  title: string;
  description: string;
  helmet: any;
  readingTime: {
    text: string;
  };
  featuredimage: {
    childImageSharp: {
      fluid: FluidObject;
    };
  };
};

export const BlogPostTemplate: FunctionComponent<BlogPostProps> = (props) => {
  const PostContent = props.contentComponent || Content;

  return (
    <>
      <HeroImage imgSrc={props.featuredimage.childImageSharp.fluid.src} height="75vh" />
      <PageContainer>
        <article style={{ margin: `${quadrupleSpacer} 0` }}>
          <Row>
            <Column md={9}>
              <Box largePadding>
                <div>
                  {props.helmet || ''}
                  <Heading>{props.title}</Heading>
                  <FlexContainer justifyContent="space-between">
                    <small>{props.date}</small>

                    <small>{props.readingTime.text}</small>
                  </FlexContainer>
                  <HorizontalRule />
                  <p style={{ fontStyle: 'italic' }}>{props.description}</p>
                  <PostContent content={props.content} />
                  <HorizontalRule />
                  {props.tags && props.tags.length ? (
                    <>
                      <h4>Tags</h4>
                      <ul>
                        {props.tags.map((tag: string) => (
                          <li key={`${tag}tag`}>
                            <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              </Box>
            </Column>
          </Row>
        </article>
      </PageContainer>
    </>
  );
};

const BlogPost = ({ data }: { data: any }) => {
  const { markdownRemark: post } = data;
  const helmet = (
    <Helmet titleTemplate="%s | packup blog">
      <title>{post.frontmatter.title}</title>
      <meta name="description" content={`${post.frontmatter.description}`} />
    </Helmet>
  );

  return (
    <BlogPostTemplate
      content={post.html}
      contentComponent={HTMLContent}
      date={post.frontmatter.date}
      helmet={helmet}
      tags={post.frontmatter.tags}
      title={post.frontmatter.title}
      featuredimage={post.frontmatter.featuredimage}
      readingTime={post.fields.readingTime}
      description={post.frontmatter.description}
    />
  );
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        readingTime {
          text
        }
      }
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
        featuredimage {
          childImageSharp {
            fluid(maxWidth: 2400, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
