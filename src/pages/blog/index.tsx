import React from 'react';

import { Seo, PageContainer } from '../../components';
import BlogRoll from '../../templates/BlogRoll';

const BlogIndexPage = () => (
  <PageContainer>
    <Seo title="Latest Stories" />
    <div>
      <h1>Latest Stories</h1>
    </div>
    <section>
      <BlogRoll />
    </section>
  </PageContainer>
);

export default BlogIndexPage;
