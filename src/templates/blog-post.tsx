import React, { FunctionComponent } from 'react';
import { kebabCase } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import { DiscussionEmbed } from 'disqus-react';

import {
  HeroImage,
  PageContainer,
  Box,
  Row,
  Column,
  Heading,
  HorizontalRule,
  FlexContainer,
  Pill,
} from '../components';
import Content, { HTMLContent } from '../components/Content';

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

  const disqusConfig = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    shortname: process.env.GATSBY_DISQUS_NAME!,
    config: { identifier: props.title },
  };

  return (
    <>
      <HeroImage imgSrc={props.featuredimage.childImageSharp.fluid.src}>
        <Heading inverse>{props.title}</Heading>
      </HeroImage>
      <PageContainer withVerticalPadding>
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
                <p>{props.description}</p>
                <PostContent content={props.content} />
                <HorizontalRule />
                {props.tags && props.tags.length ? (
                  <>
                    <h4>Tags</h4>
                    <ul style={{ margin: 0, padding: 0 }}>
                      {props.tags.map((tag: string) => (
                        <Pill key={`${tag}tag`} to={`/tags/${kebabCase(tag)}/`} text={tag} />
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
              <HorizontalRule />
              <Heading as="h3">Comments</Heading>
              <DiscussionEmbed {...disqusConfig} />
            </Box>
          </Column>
        </Row>
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
