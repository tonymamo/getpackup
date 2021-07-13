import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';

import { PreviewCompatibleImage } from '@components';
import { FixedImageType } from '@common/image';
import trackEvent from '@utils/trackEvent';

type RelatedBlogPostProps = {
  type: 'next' | 'prev';
  post: {
    fields: {
      slug: string;
      readingTime: {
        text: string;
      };
    };
    featuredimage: FixedImageType;
    frontmatter: {
      date: string;
      description: string;
      title: string;
    };
  };
};

const RelatedBlogPost: FunctionComponent<RelatedBlogPostProps> = (props) => {
  return (
    <>
      <Link
        to={props.post.fields.slug}
        onClick={() =>
          trackEvent('Related Blog Post Image Click', { post: props.post.frontmatter.title })
        }
      >
        <PreviewCompatibleImage
          style={{ height: 200 }}
          imageInfo={{
            image: props.post.featuredimage,
            alt: `featured image thumbnail for post ${props.post.frontmatter.title}`,
          }}
        />
      </Link>
      <small>{props.post.frontmatter.date}</small>
      <p>
        <Link
          to={props.post.fields.slug}
          onClick={() =>
            trackEvent('Related Blog Post Text Click', { post: props.post.frontmatter.title })
          }
        >
          {props.post.frontmatter.title}
        </Link>
      </p>
    </>
  );
};

export default RelatedBlogPost;
