import React from 'react';

import { HeroImage, Seo, PageContainer, Heading } from '../../components';
import BlogRoll from '../../templates/BlogRoll';
import image from '../../images/SingleHikerApproachingBaseOfMountainWithAnotherMountainInTheBackground.jpg';

import { quadrupleSpacer } from '../../styles/size';

const BlogIndexPage = () => (
  <>
    <Seo title="Latest Stories" />
    <HeroImage imgSrc={image} height="500px">
      <PageContainer>
        <Heading as="h1" inverse align="center">
          Latest Stories
        </Heading>
      </PageContainer>
    </HeroImage>
    <section
      style={{
        padding: `${quadrupleSpacer} 0`,
      }}
    >
      <PageContainer>
        <section>
          <BlogRoll />
        </section>
      </PageContainer>
    </section>
  </>
);

export default BlogIndexPage;
