/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useStaticQuery, graphql } from 'gatsby';
import { useLocation } from '@reach/router';

type SeoType = {
  description?: string;
  image?: string;
  meta?: Array<{
    content: string;
    name: string;
  }>;
  title?: string;
  lang?: string;
  imageWidth?: number;
  imageHeight?: number;
};

const Seo: FunctionComponent<SeoType> = ({
  title,
  description,
  image,
  lang,
  meta,
  imageWidth,
  imageHeight,
}) => {
  const { pathname } = useLocation();
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            author
            defaultDescription: description
            siteUrl: url
            defaultImage: image
          }
        }
      }
    `
  );

  const { defaultTitle, defaultDescription, siteUrl, defaultImage } = site.siteMetadata;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
    imageWidth: imageWidth || 1080,
    imageHeight: imageHeight || 1080,
  };

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}: Adventure made easy.`}
      meta={[
        {
          property: 'og:url',
          content: seo.url,
        },
        {
          name: 'image',
          content: seo.image,
        },
        {
          property: 'og:image',
          content: seo.image,
        },
        {
          property: 'og:image:width',
          content: seo.imageWidth,
        },
        {
          property: 'og:image:height',
          content: seo.imageHeight,
        },
        {
          name: 'description',
          content: seo.description,
        },
        {
          property: 'og:title',
          content: seo.title,
        },

        {
          property: 'og:description',
          content: seo.description,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:creator',
          content: site.siteMetadata.author,
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: seo.description,
        },
        {
          name: 'twitter:image',
          content: seo.image,
        },
      ].concat(meta || [])}
    />
  );
};

Seo.defaultProps = {
  lang: 'en',
  meta: [],
  description: '',
};

export default Seo;
