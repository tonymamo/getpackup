import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import { FluidObject } from 'gatsby-image';
import PreviewCompatibleImage from './PreviewCompatibleImage';

type RelatedBlogPostProps = {
  type: 'next' | 'prev';
  post: {
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
};

const RelatedBlogPost: FunctionComponent<RelatedBlogPostProps> = (props) => {
  return (
    <>
      <Link to={props.post.fields.slug}>
        <PreviewCompatibleImage
          style={{ height: 200 }}
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
  );
};

export default RelatedBlogPost;
