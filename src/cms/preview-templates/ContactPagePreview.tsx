import React from 'react';

import { MarkdownContent, Layout } from '@components';
import { ContactPageTemplate } from '@templates/contact-page';

const ContactPagePreview = ({ entry }: { entry: any }) => {
  const data = entry.getIn(['data']).toJS();
  if (data) {
    return (
      <Layout hideFromCms>
        <ContactPageTemplate
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

export default ContactPagePreview;
