import React from 'react';
import { kebabCase } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { graphql, Link } from 'gatsby';

import { PageContainer } from '../components';
import Content, { HTMLContent } from '../components/Content';

interface BlogPostProps {
  content: any;
  contentComponent: any;
  description: any;
  tags: any;
  title: any;
  helmet: any;
}
export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  helmet,
}: BlogPostProps) => {
  const PostContent = contentComponent || Content;

  return (
    <PageContainer>
      <div>
        {helmet || ''}
        <h1>{title}</h1>
        <p>{description}</p>
        <PostContent content={content} />
        {tags && tags.length ? (
          <>
            <h4>Tags</h4>
            <ul>
              {tags.map((tag: string) => (
                <li key={`${tag}tag`}>
                  <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </PageContainer>
  );
};

const BlogPost = ({ data }: { data: any }) => {
  const { markdownRemark: post } = data;
  const helmet = (
    <Helmet titleTemplate="%s | Realty Offer Blog">
      <title>{post.frontmatter.title}</title>
      <meta name="description" content={`${post.frontmatter.description}`} />
    </Helmet>
  );

  return (
    <BlogPostTemplate
      content={post.html}
      contentComponent={HTMLContent}
      description={post.frontmatter.description}
      helmet={helmet}
      tags={post.frontmatter.tags}
      title={post.frontmatter.title}
    />
  );
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
      }
    }
  }
`;
