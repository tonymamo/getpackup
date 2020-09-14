import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';

import PreviewCompatibleImage from './PreviewCompatibleImage';

type RelatedBlogPostProps = {
  type: 'next' | 'prev';
  post?: {
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
          fluid: {
            src: string;
          };
        };
      };
    };
  };
};

const RelatedBlogPost: FunctionComponent<RelatedBlogPostProps> = (props) => {
  return (
    <>
      {props.post && (
        <>
          <Link to={props.post.fields.slug}>
            <PreviewCompatibleImage
              imageInfo={{
                image: props.post.frontmatter.featuredimage,
                alt: `featured image thumbnail for post ${props.post.frontmatter.title}`,
              }}
            />
          </Link>

          <small>{props.post.frontmatter.date}</small>

          <p>
            <Link to={props.post.fields.slug}>{props.post.frontmatter.title}</Link>
          </p>
        </>
      )}
    </>
  );
};

export default RelatedBlogPost;
