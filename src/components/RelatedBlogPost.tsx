import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import { FluidObject } from 'gatsby-image';

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
        <img
          src={props.post.frontmatter.featuredimage.childImageSharp.fluid.src}
          alt={`featured thumbnail for post ${props.post.frontmatter.title}`}
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
