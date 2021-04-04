import React from 'react';

import { MarkdownContent, Layout } from '@components';
import { TermsTemplate } from '../../templates/terms';

const TermsPagePreview = ({ entry }: { entry: any }) => {
  const data = entry.getIn(['data']).toJS();
  if (data) {
    return (
      <Layout hideFromCms>
        <TermsTemplate
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

export default TermsPagePreview;
