import React from 'react';

import { HeroImage, Seo, PageContainer, Heading } from '../../components';
import BlogRoll from '../../templates/BlogRoll';
import image from '../../images/SingleHikerApproachingBaseOfMountainWithAnotherMountainInTheBackground.jpg';

const BlogIndexPage = () => (
  <>
    <Seo title="Latest Stories" />
    <HeroImage imgSrc={image}>
      <PageContainer>
        <Heading as="h1" inverse align="center">
          Latest Stories
        </Heading>
      </PageContainer>
    </HeroImage>

    <PageContainer withVerticalPadding>
      <section>
        <BlogRoll />
      </section>
    </PageContainer>
  </>
);

export default BlogIndexPage;
