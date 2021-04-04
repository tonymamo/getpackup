/* eslint-disable */
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  flags: {
    FAST_DEV: false,
    PARALLEL_SOURCING: true,
  },
  siteMetadata: {
    title: 'Packup',
    description:
      'Get outside faster and safer with the Packup app. Use the trip generator to build your packing list, collaborate and plan with your friends, and learn from what the pros and other users have packed on their trips.',
    author: '@getpackup',
    url: 'https://getpackup.com',
    siteUrl: 'https://getpackup.com',
    image: '/img/collage.jpg',
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-react-helmet-async',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-eslint',
    'gatsby-plugin-smoothscroll',
    'gatsby-plugin-advanced-sitemap',
    'gatsby-plugin-robots-txt',
    'gatsby-plugin-instagram-embed',
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        alias: {
          '@common': `${__dirname}/src/common`,
          '@components': `${__dirname}/src/components`,
          '@images': `${__dirname}/src/images`,
          '@redux': `${__dirname}/src/redux`,
          '@styles': `${__dirname}/src/styles`,
          '@utils': `${__dirname}/src/utils`,
          '@templates': `${__dirname}/src/templates`,
          '@views': `${__dirname}/src/views`,
        },
        extensions: [],
      },
    },
    {
      resolve: 'gatsby-plugin-create-client-paths',
      options: { prefixes: [`/app/*`, `/admin/*`] },
    },
    {
      resolve: 'gatsby-plugin-mailchimp',
      options: {
        endpoint: process.env.GATSBY_MAILCHIMP_ENDPOINT,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blog',
        path: `${__dirname}/src/pages/blog`,
      },
    },
    // 'gatsby-plugin-extract-schema',
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: '#C46200',
        showSpinner: false,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'packup',
        description:
          'Adventure made easy. Pack with confidence with a trip generator for any occasion, create and share collaborative packing lists, and learn from others and view the trips they packed for.',
        short_name: 'packup',
        lang: 'en',
        start_url: '/',
        background_color: '#f3f3f3',
        theme_color: '#0E3757',
        orientation: 'portrait',
        categories: ['packing', 'outdoors', 'productivity', 'safety'],
        shortcuts: [
          {
            name: 'Add New Trip',
            short_name: 'New Trip',
            description: 'Quickly create a new trip',
            url: '/app/trips/new',
            icons: [{ src: '/img/shortcut-add-trip.png', sizes: '192x192' }],
          },
          {
            name: 'View All Trips',
            short_name: 'All Trips',
            description: 'View the list of all your trips',
            url: '/app/trips',
            icons: [{ src: '/img/shortcut-trips.png', sizes: '192x192' }],
          },
          {
            name: 'View My Profile',
            short_name: 'My Profile',
            description: 'View and Edit My Profile',
            url: '/app/profile',
            icons: [{ src: '/img/shortcut-profile.png', sizes: '192x192' }],
          },
        ],
        display: 'standalone',
        icon: 'src/images/maskable_icon.png', // This path is relative to the root of the site.
        icon_options: {
          purpose: `any maskable`,
        },
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-reading-time',
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              icon:
                '<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>',
            },
          },
          'gatsby-remark-images-anywhere',
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'noreferrer noopener',
            },
          },
          'gatsby-remark-responsive-iframe',
        ],
      },
    },
    {
      resolve: 'gatsby-transformer-cloudinary',
      options: {
        cloudName: process.env.GATSBY_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.GATSBY_CLOUDINARY_API_KEY,
        apiSecret: process.env.GATSBY_CLOUDINARY_API_SECRET,
        uploadFolder: 'getpackup',
        fluidMaxWidth: 2048,
        overwrite: false,
      },
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        publicPath: 'cms',
        modulePath: `${__dirname}/src/cms/cms.ts`,
      },
    },
    {
      resolve: 'gatsby-plugin-segment-js',
      options: {
        prodKey:
          process.env.GATSBY_SITE_URL === 'https://test.getpackup.com'
            ? process.env.GATSBY_TEST_SEGMENT_API_KEY
            : process.env.GATSBY_PROD_SEGMENT_API_KEY,
        devKey: '',
        trackPage: true,
        trackPageDelay: 50,
        delayLoad: true,
        delayLoadTime: 1000,
      },
    },
    {
      resolve: 'gatsby-plugin-gdpr-cookies',
      options: {
        googleAnalytics: {
          trackingId: process.env.GATSBY_GOOGLE_ANALYTICS_TRACKING_ID, // leave empty if you want to disable the tracker
          cookieName: 'packup-gdpr-google-analytics',
          anonymize: true, // default
          allowAdFeatures: false, // default
        },
        googleTagManager: {
          trackingId: process.env.GATSBY_GOOGLE_TAG_MANAGER_CONTAINER_ID, // leave empty if you want to disable the tracker
          cookieName: 'packup-gdpr-google-tagmanager',
          dataLayerName: 'dataLayer', // default
        },
        facebookPixel: {
          pixelId: '', // leave empty if you want to disable the tracker
          cookieName: 'packup-gdpr-facebook-pixel',
        },
        // defines the environments where the tracking should be available  - default is ["production"]
        environments: ['production', 'development'],
      },
    },
    // {
    //   resolve: `gatsby-source-firestore-easy`,
    //   options: {
    //     adminCredential: {
    //       credential: Buffer.from(process.env.FIREBASE_ADMIN_CREDENTIAL, 'base64').toString(),
    //       databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL,
    //     },
    //     collections: ['users'],
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    'gatsby-plugin-offline',
  ],
};
