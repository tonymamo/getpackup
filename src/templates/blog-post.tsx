import { FixedImageType, FluidImageType } from '@common/image';
import {
  Box,
  ClientOnly,
  Column,
  Content,
  FlexContainer,
  HTMLContent,
  Heading,
  HeroImage,
  HorizontalRule,
  PageContainer,
  Pill,
  RelatedBlogPost,
  Row,
  Seo,
  Share,
} from '@components';
import useWindowSize from '@utils/useWindowSize';
import { DiscussionEmbed } from 'disqus-react';
import { graphql } from 'gatsby';
import { kebabCase } from 'lodash';
import React, { FunctionComponent, useEffect } from 'react';

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
  };
  featuredimage: FixedImageType;
};

type BlogPostProps = {
  hideFromCms?: boolean;
  pageContext?: {
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
  featuredimage: FixedImageType & FluidImageType;
};

export const BlogPostTemplate: FunctionComponent<BlogPostProps> = (props) => {
  const PostContent = props.contentComponent || Content;
  const size = useWindowSize();

  const disqusConfig = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    shortname: process.env.GATSBY_DISQUS_NAME!,
    config: { identifier: props.title },
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <div>
      {!props.hideFromCms && (
        <Seo
          title={props.title}
          description={props.description}
          image={props.featuredimage.fixed.src}
          imageWidth={props.featuredimage.fixed.width}
          imageHeight={props.featuredimage.fixed.height}
        />
      )}
      {typeof window !== 'undefined' &&
        !size.isExtraSmallScreen &&
        !props.hideFromCms &&
        props.pageContext && (
          <ClientOnly>
            <Share
              url={props.pageContext.slug}
              title={props.title}
              tags={props.tags}
              vertical
              media={props.featuredimage.fixed.src}
              description={props.description}
            />
          </ClientOnly>
        )}
      {!props.hideFromCms && (
        <HeroImage imgSrc={props.featuredimage}>
          <Heading inverse>{props.title}</Heading>
        </HeroImage>
      )}

      <PageContainer withVerticalPadding>
        <Box largePadding>
          <Row>
            <Column md={8} mdOffset={2}>
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
                {!props.hideFromCms && props.pageContext && (
                  <Share
                    url={props.pageContext.slug}
                    title={props.title}
                    tags={props.tags}
                    media={props.featuredimage.fixed.src}
                    description={props.description}
                  />
                )}
                {props.tags && props.tags.length ? (
                  <>
                    {props.tags.map((tag: string) => (
                      <Pill
                        key={`${tag}tag`}
                        to={`/tags/${kebabCase(tag)}/`}
                        text={tag}
                        color="primary"
                      />
                    ))}
                  </>
                ) : null}
                <HorizontalRule />
                <p style={{ fontStyle: 'italic' }}>{props.description}</p>
                <HorizontalRule />
                <div className="blog-content">
                  <PostContent content={props.content} />
                </div>
                <br />
                <br />
                <br />
                <br />
                {!props.hideFromCms && props.pageContext && (
                  <Share
                    url={props.pageContext.slug}
                    title={props.title}
                    tags={props.tags}
                    media={props.featuredimage.fixed.src}
                    description={props.description}
                  />
                )}
                <HorizontalRule />
                {props.tags && props.tags.length ? (
                  <>
                    {props.tags.map((tag: string) => (
                      <Pill
                        key={`${tag}tag`}
                        to={`/tags/${kebabCase(tag)}/`}
                        text={tag}
                        color="primary"
                      />
                    ))}
                  </>
                ) : null}
                <HorizontalRule />
              </div>
              <Heading as="h3">Keep Reading</Heading>
              {!props.hideFromCms && props.pageContext && (
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
              {!props.hideFromCms && <DiscussionEmbed {...disqusConfig} />}
            </Column>
          </Row>
        </Box>
      </PageContainer>
    </div>
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
      featuredimage={post.featuredimage}
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
      featuredimage {
        fluid {
          base64
          ...CloudinaryAssetFluid
        }
        fixed(width: 1200) {
          ...CloudinaryAssetFixed
        }
      }
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
      }
    }
  }
`;
