import React from 'react';

import { ContactPageTemplate } from '../../templates/contact-page';
import { MarkdownContent } from '../../components/Content';
import { Layout } from '../../components';

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
