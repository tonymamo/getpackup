import { Layout } from '@components';
import React from 'react';

import { IndexPageTemplate } from '../../templates/index-page';

const IndexPagePreview = ({ entry }: { entry: any }) => {
  const data = entry.getIn(['data']).toJS();
  if (data) {
    return (
      <Layout hideFromCms>
        <IndexPageTemplate
          hideFromCms
          heroImage={data.heroImage}
          mobileHeroImage={data.mobileHeroImage}
          title={data.title}
          heroHeading={data.heroHeading}
          typewriterList={data.typewriterList}
          heroSubheading={data.heroSubheading}
          heroCTALink={data.heroCTALink}
          heroCTAText={data.heroCTAText}
          mainpitch={data.mainpitch}
          mainpitchImage={data.mainpitchImage}
          secondpitch={data.secondpitch}
          secondpitchImage={data.secondpitchImage}
          thirdpitch={data.thirdpitch}
          thirdpitchImage={data.thirdpitchImage}
          fourthpitch={data.fourthpitch}
          fourthpitchImage={data.fourthpitchImage}
          testimonials={data.testimonials}
          pageContext={data.pageContext}
          posts={data.posts}
        />
      </Layout>
    );
  }
  return <div>Loading...</div>;
};

export default IndexPagePreview;
