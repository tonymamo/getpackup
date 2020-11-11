import React from 'react';

import { IndexPageTemplate } from '../../templates/index-page';

import { Layout } from '../../components';

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
          secondpitch={data.secondpitch}
          thirdpitch={data.thirdpitch}
          signupform={data.signupform}
          testimonials={data.testimonials}
        />
      </Layout>
    );
  }
  return <div>Loading...</div>;
};

export default IndexPagePreview;
