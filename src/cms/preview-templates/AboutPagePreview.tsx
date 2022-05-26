import { Layout, MarkdownContent } from '@components';
import React from 'react';

import { AboutPageTemplate } from '../../templates/about-page';

const AboutPagePreview = ({ entry }: { entry: any }) => {
  const data = entry.getIn(['data']).toJS();
  if (data) {
    return (
      <Layout hideFromCms>
        <AboutPageTemplate
          hideFromCms
          contentComponent={MarkdownContent}
          title={data.title}
          heroImage={data.heroImage}
          content={data.body}
        />
      </Layout>
    );
  }
  return <div>Loading...</div>;
};

export default AboutPagePreview;
