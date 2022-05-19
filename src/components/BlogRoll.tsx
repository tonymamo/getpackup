import { BlogRollType } from '@common/blogRoll';
import { Box, Column, Heading, HorizontalRule, PreviewCompatibleImage, Row } from '@components';
import trackEvent from '@utils/trackEvent';
import { Link } from 'gatsby';
/* eslint-disable react/display-name */
import React, { FunctionComponent } from 'react';

type BlogRollProps = {
  posts: BlogRollType;
};

const BlogRoll: FunctionComponent<BlogRollProps> = ({ posts }) => {
  return (
    <Row>
      {posts &&
        posts.map(({ node: post }: any) => (
          <Column md={4} key={post.id}>
            <Box>
              <div style={{ textAlign: 'left' }}>
                {post.featuredimage && (
                  <Link
                    to={post.fields.slug}
                    onClick={() =>
                      trackEvent('Blog Roll Image Clicked', { blog: post.frontmatter.title })
                    }
                  >
                    <PreviewCompatibleImage
                      imageInfo={{
                        image: post.featuredimage,
                        alt: `featured image thumbnail for post ${post.frontmatter.title}`,
                      }}
                      style={{ height: 200 }}
                    />
                  </Link>
                )}
                <small>
                  {post.frontmatter.date} - {post.fields.readingTime.text}
                </small>
                <Heading as="h2" noMargin>
                  <Link
                    to={post.fields.slug}
                    onClick={() =>
                      trackEvent('Blog Roll Title Clicked', { blog: post.frontmatter.title })
                    }
                  >
                    {post.frontmatter.title}
                  </Link>
                </Heading>
                <HorizontalRule compact />

                <small style={{ fontStyle: 'italic' }}>{post.frontmatter.description}</small>
              </div>
            </Box>
          </Column>
        ))}
    </Row>
  );
};

export default BlogRoll;
