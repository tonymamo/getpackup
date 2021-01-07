import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import { HeroImage, Seo, PageContainer, Heading } from '@components';

type ProfileIndexProps = {
  title: string;
  heroImage: { childImageSharp: { fluid: FluidObject } };
};

export const ProfileIndexTemplate: FunctionComponent<ProfileIndexProps> = ({
  title,
  heroImage,
}) => (
  <>
    <Seo title={title} />
    <HeroImage imgSrc={heroImage}>
      <PageContainer>
        <Heading as="h1" inverse align="center">
          {title}
        </Heading>
      </PageContainer>
    </HeroImage>

    <PageContainer withVerticalPadding>
      <section>Profiles Go Here</section>
    </PageContainer>
  </>
);

const ProfileIndexPage = ({
  data: {
    markdownRemark: {
      frontmatter: { title, heroImage },
    },
  },
}: {
  data: { markdownRemark: { frontmatter: ProfileIndexProps; html: any } };
}) => <ProfileIndexTemplate title={title} heroImage={heroImage} />;

export default ProfileIndexPage;

export const profileIndexPageQuery = graphql`
  query ProfileIndexPage {
    markdownRemark(frontmatter: { templateKey: { eq: "profile-index-page" } }) {
      html
      frontmatter {
        title
        heroImage {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 60) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
  }
`;
