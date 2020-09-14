import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';

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
            <img src={props.post.frontmatter.featuredimage.childImageSharp.fluid.src} alt="" />
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
