import React from 'react';

import { Layout } from '@components';
import { LinksPageTemplate } from '../../templates/links-page';

const LinksPagePreview = ({ entry }: { entry: any }) => {
  const data = entry.getIn(['data']).toJS();
  if (data) {
    return (
      <Layout hideFromCms>
        <LinksPageTemplate hideFromCms linksList={data.linksList} />
      </Layout>
    );
  }
  return <div>Loading...</div>;
};

export default LinksPagePreview;
