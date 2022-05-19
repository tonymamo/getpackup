import { Layout, MarkdownContent } from '@components';
import React from 'react';

import { PrivacyTemplate } from '../../templates/privacy';

const PrivacyPagePreview = ({ entry }: { entry: any }) => {
  const data = entry.getIn(['data']).toJS();
  if (data) {
    return (
      <Layout hideFromCms>
        <PrivacyTemplate
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

export default PrivacyPagePreview;
