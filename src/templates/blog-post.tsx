import React, { FunctionComponent } from 'react';
import { kebabCase } from 'lodash';
import { graphql } from 'gatsby';
import { FluidObject, FixedObject } from 'gatsby-image';
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
  Seo,
  RelatedBlogPost,
  Share,
  ClientOnly,
} from '../components';
import Content, { HTMLContent } from '../components/Content';
import useWindowSize from '../utils/useWindowSize';
import { screenSizes } from '../styles/size';

type RelatedPostType = {
  fields: {
    slug: string;
    readingTime: {
      text: string;
    };
  };
  frontmatter: {
    date: string;
    description: string;
    title: string;
    featuredimage: {
      childImageSharp: {
        fluid: FluidObject;
      };
    };
  };
};

type BlogPostProps = {
  hideFromCms?: boolean;
  pageContext: {
    slug: string;
    next: RelatedPostType;
    prev: RelatedPostType;
  };
  content: any;
  contentComponent: any;
  date: string;
  tags: Array<string>;
  title: string;
  description: string;
  readingTime: {
    text: string;
  };
  featuredimage: {
    childImageSharp: {
      fluid: FluidObject;
      fixed: FixedObject;
    };
  };
};

export const BlogPostTemplate: FunctionComponent<BlogPostProps> = (props) => {
  const PostContent = props.contentComponent || Content;

  const size = useWindowSize();
  const isSmallScreen = Boolean(size && size.width && size.width < screenSizes.small);

  const disqusConfig = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    shortname: process.env.GATSBY_DISQUS_NAME!,
    config: { identifier: props.title },
  };

  return (
    <>
      {!props.hideFromCms && (
        <Seo
          title={props.title}
          description={props.description}
          image={props.featuredimage.childImageSharp.fixed.src}
          imageWidth={props.featuredimage.childImageSharp.fixed.width}
          imageHeight={props.featuredimage.childImageSharp.fixed.height}
        />
      )}
      {typeof window !== 'undefined' && !isSmallScreen && (
        <ClientOnly>
          <Share
            url={props.pageContext.slug}
            title={props.title}
            tags={props.tags}
            vertical
            media={props.featuredimage.childImageSharp.fixed.src}
            description={props.description}
          />
        </ClientOnly>
      )}
      <HeroImage imgSrc={props.featuredimage}>
        <Heading inverse>{props.title}</Heading>
      </HeroImage>
      <PageContainer withVerticalPadding>
        <Row>
          <Column md={9}>
            <Box largePadding>
              <div>
                <Heading>{props.title}</Heading>
                <FlexContainer justifyContent="space-between">
                  <p>
                    <small>{props.date}</small>
                  </p>
                  <p>
                    <small>{props.readingTime.text}</small>
                  </p>
                </FlexContainer>

                <Share
                  url={props.pageContext.slug}
                  title={props.title}
                  tags={props.tags}
                  media={props.featuredimage.childImageSharp.fixed.src}
                  description={props.description}
                />

                {props.tags && props.tags.length ? (
                  <ul style={{ margin: '0 0 0 -4px', padding: 0 }}>
                    {props.tags.map((tag: string) => (
                      <Pill key={`${tag}tag`} to={`/tags/${kebabCase(tag)}/`} text={tag} />
                    ))}
                  </ul>
                ) : null}
                <HorizontalRule />

                <p style={{ fontStyle: 'italic' }}>{props.description}</p>
                <HorizontalRule />
                <PostContent content={props.content} />
                <br />
                <br />
                <br />
                <br />
                <Share
                  url={props.pageContext.slug}
                  title={props.title}
                  tags={props.tags}
                  media={props.featuredimage.childImageSharp.fixed.src}
                  description={props.description}
                />
                <HorizontalRule />
                {props.tags && props.tags.length ? (
                  <ul style={{ margin: '0 0 0 -4px', padding: 0 }}>
                    {props.tags.map((tag: string) => (
                      <Pill key={`${tag}tag`} to={`/tags/${kebabCase(tag)}/`} text={tag} />
                    ))}
                  </ul>
                ) : null}
                <HorizontalRule />
              </div>
              <Heading as="h3">Keep Reading</Heading>
              {!props.hideFromCms && (
                <Row>
                  <Column xs={6}>
                    <RelatedBlogPost post={props.pageContext.prev} type="prev" />
                  </Column>
                  <Column xs={6}>
                    <RelatedBlogPost post={props.pageContext.next} type="next" />
                  </Column>
                </Row>
              )}

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

const BlogPost = ({ data, pageContext }: { data: any; pageContext: any }) => {
  const { markdownRemark: post } = data;

  return (
    <BlogPostTemplate
      content={post.html}
      contentComponent={HTMLContent}
      date={post.frontmatter.date}
      tags={post.frontmatter.tags}
      title={post.frontmatter.title}
      featuredimage={post.frontmatter.featuredimage}
      readingTime={post.fields.readingTime}
      description={post.frontmatter.description}
      pageContext={pageContext}
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
            fluid(maxWidth: 2400, quality: 60) {
              ...GatsbyImageSharpFluid_withWebp
            }
            fixed(width: 1080, quality: 60) {
              ...GatsbyImageSharpFixed_withWebp
            }
          }
        }
      }
    }
  }
`;
