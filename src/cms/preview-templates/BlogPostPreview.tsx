import React from 'react';

import { MarkdownContent, Layout } from '@components';
import { BlogPostTemplate } from '../../templates/blog-post';

const BlogPostPreview = ({ entry }: { entry: any }) => {
  const data = entry.getIn(['data']).toJS();
  if (data) {
    return (
      <Layout hideFromCms>
        <BlogPostTemplate
          hideFromCms
          content={data.body}
          contentComponent={MarkdownContent}
          date={new Date(data.date).toDateString()}
          tags={data.tags}
          title={data.title}
          featuredimage={data.featuredimage}
          readingTime={{ text: '' }}
          description={data.description}
          pageContext={undefined}
        />
      </Layout>
    );
  }
  return <div>Loading...</div>;
};

export default BlogPostPreview;
