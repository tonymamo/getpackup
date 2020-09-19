import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import { FluidObject } from 'gatsby-image';

import { HeroImage, Seo, PageContainer, Heading } from '../components';
import BlogRoll from './BlogRoll';

type BlogIndexProps = {
  title: string;
  heroImage: { childImageSharp: { fluid: FluidObject } };
};

export const BlogIndexTemplate: FunctionComponent<BlogIndexProps> = (props) => (
  <>
    <Seo title={props.title} />
    <HeroImage imgSrc={props.heroImage}>
      <PageContainer>
        <Heading as="h1" inverse align="center">
          {props.title}
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

const BlogIndexPage = ({
  data,
}: {
  data: { markdownRemark: { frontmatter: BlogIndexProps; html: any } };
}) => {
  const { markdownRemark: post } = data;
  return (
    <BlogIndexTemplate title={post.frontmatter.title} heroImage={post.frontmatter.heroImage} />
  );
};

export default BlogIndexPage;

export const blogIndexPageQuery = graphql`
  query BlogIndexPage {
    markdownRemark(frontmatter: { templateKey: { eq: "blog-index-page" } }) {
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
