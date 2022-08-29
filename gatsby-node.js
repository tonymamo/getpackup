/* eslint-disable @typescript-eslint/no-var-requires */
const _ = require('lodash');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const { createRemoteImageNode } = require('gatsby-transformer-cloudinary');
const LoadablePlugin = require('@loadable/webpack-plugin');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type MarkdownRemarkFrontmatter {
      title: String!
    }
    type MarkdownRemark implements Node {
      frontmatter: MarkdownRemarkFrontmatter!
    }
    
  `;
  createTypes(typeDefs);
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  // featuredimage is for prev/next blog posts to pass in page context
  return graphql(`
    {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
              readingTime {
                text
              }
            }
            featuredimage {
              fluid {
                aspectRatio
                base64
                presentationHeight
                presentationWidth
                sizes
                src
                srcSet
                tracedSVG
              }
              fixed {
                aspectRatio
                base64
                height
                src
                srcSet
                width
              }
            }
            frontmatter {
              tags
              templateKey
              title
              date(formatString: "MMMM DD, YYYY")
              description
            }
          }
        }
      }
    }
  `).then(
    // eslint-disable-next-line consistent-return
    (result) => {
      if (result.errors) {
        // eslint-disable-next-line no-console
        result.errors.forEach((e) => console.error(e.toString()));
        return Promise.reject(result.errors);
      }

      const nonBlogPosts = result.data.allMarkdownRemark.edges.filter(
        (p) => p.node.frontmatter.templateKey !== 'blog-post'
      );

      const blogPosts = result.data.allMarkdownRemark.edges.filter(
        (p) => p.node.frontmatter.templateKey === 'blog-post'
      );

      nonBlogPosts.forEach((edge) => {
        const { id } = edge.node;

        if (edge.node.frontmatter.templateKey === 'blog-index-page') {
          const postsPerPage = 6;
          const numPages = Math.ceil(blogPosts.length / postsPerPage);

          Array.from({ length: numPages }).forEach((p, i) => {
            createPage({
              path: i === 0 ? `/blog` : `/blog/${i + 1}`,
              component: path.resolve('src/templates/blog-index-page.tsx'),
              context: {
                id,
                limit: postsPerPage,
                skip: i * postsPerPage,
                numPages,
                currentPage: i + 1,
              },
            });
          });
        }

        if (edge.node.frontmatter.templateKey !== 'blog-index-page') {
          createPage({
            path: edge.node.fields.slug,
            component: path.resolve(
              `src/templates/${String(edge.node.frontmatter.templateKey)}.tsx`
            ),
            // additional data can be passed via context
            context: {
              id,
            },
          });
        }
      });

      blogPosts.forEach((edge, index) => {
        const { id } = edge.node;
        createPage({
          path: edge.node.fields.slug,
          component: path.resolve(`src/templates/blog-post.tsx`),
          // additional data can be passed via context
          context: {
            id,
            slug: edge.node.fields.slug,
            prev: index === 0 ? blogPosts[blogPosts.length - 1].node : blogPosts[index - 1].node,
            next: index === blogPosts.length - 1 ? blogPosts[0].node : blogPosts[index + 1].node,
          },
        });
      });

      // result.data.allUsers.edges.forEach((edge) => {
      //   const { username } = edge.node;

      //   createPage({
      //     path: `/${username}`,
      //     component: path.resolve(`src/templates/public-profile.tsx`),
      //     // additional data can be passed via context
      //     context: {
      //       username,
      //     },
      //   });
      // });

      // Tag pages:
      let tags = [];
      // Iterate through each post, putting all found tags into `tags`
      blogPosts.forEach((edge) => {
        if (_.get(edge, 'node.frontmatter.tags')) {
          tags = tags.concat(edge.node.frontmatter.tags);
        }
      });
      // Eliminate duplicate tags
      tags = _.uniq(tags);

      // Make tag pages
      tags.forEach((tag) => {
        const tagPath = `/tags/${_.kebabCase(tag)}/`;

        createPage({
          path: tagPath,
          component: path.resolve('src/templates/tags.tsx'),
          context: {
            tag,
          },
        });
      });
    }
  );
};

exports.onCreateNode = async ({
  node,
  actions,
  getNode,
  createNodeId,
  createContentDigest,
  reporter,
}) => {
  const { createNodeField, createNode } = actions;

  const POST_NODE_TYPE = 'MarkdownRemark';

  if (node.internal.type === POST_NODE_TYPE) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: 'slug',
      node,
      value,
    });

    if (node.frontmatter && node.frontmatter.heroImage) {
      await createRemoteImageNode({
        url: node.frontmatter.heroImage,
        parentNode: node,
        relationshipName: 'heroImage',
        createNode,
        createNodeId,
        createContentDigest,
        reporter,
      });
    }

    if (node.frontmatter && node.frontmatter.mobileHeroImage) {
      await createRemoteImageNode({
        url: node.frontmatter.mobileHeroImage,
        parentNode: node,
        relationshipName: 'mobileHeroImage',
        createNode,
        createNodeId,
        createContentDigest,
        reporter,
      });
    }

    if (node.frontmatter && node.frontmatter.mainpitch) {
      await createRemoteImageNode({
        url: node.frontmatter.mainpitch.image,
        parentNode: node,
        relationshipName: 'mainpitchImage',
        createNode,
        createNodeId,
        createContentDigest,
        reporter,
      });
    }

    if (node.frontmatter && node.frontmatter.secondpitch) {
      await createRemoteImageNode({
        url: node.frontmatter.secondpitch.image,
        parentNode: node,
        relationshipName: 'secondpitchImage',
        createNode,
        createNodeId,
        createContentDigest,
        reporter,
      });
    }

    if (node.frontmatter && node.frontmatter.thirdpitch) {
      await createRemoteImageNode({
        url: node.frontmatter.thirdpitch.image,
        parentNode: node,
        relationshipName: 'thirdpitchImage',
        createNode,
        createNodeId,
        createContentDigest,
        reporter,
      });
    }

    if (node.frontmatter && node.frontmatter.fourthpitch) {
      await createRemoteImageNode({
        url: node.frontmatter.fourthpitch.image,
        parentNode: node,
        relationshipName: 'fourthpitchImage',
        createNode,
        createNodeId,
        createContentDigest,
        reporter,
      });
    }

    if (node.frontmatter && node.frontmatter.featuredimage) {
      await createRemoteImageNode({
        url: node.frontmatter.featuredimage,
        parentNode: node,
        relationshipName: 'featuredimage',
        createNode,
        createNodeId,
        createContentDigest,
        reporter,
      });
    }
  }
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [new LoadablePlugin()],
  });
};
