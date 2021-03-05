[![Netlify Status](https://api.netlify.com/api/v1/badges/24009d09-87ab-48e9-8eff-d7164c92eac2/deploy-status)](https://app.netlify.com/sites/getpackup/deploys)

<p align="center">
  <img src="https://getpackup.com/img/collage.jpg" />
  <a href="https://getpackup.com/">
    <img alt="Packup" src="https://getpackup.com/img/avatar.jpg" width="96px" />
  </a>
</p>
<h1 align="center">
  Packup - Frontend
</h1>

A Gatsby project using React, Firebase, Redux, Styled-Components, Formik, NetlifyCMS, and more.

## 🚀 Quick start

1.  **Clone Repo and install dependencies**

    Use `git clone`, then `cd` into your local repo and run `yarn` to install dependencies.

    ```shell
    # Clone and install dependencies
    git clone https://github.com/tonymamo/getpackup.git
    cd getpackup
    yarn
    ```

1.  **Get environment set up**
    Ask @tonymamo for a .env.development and .env.production file to put in the root of your project

1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd getpackup/
    # `yarn start` is the same as `gatsby develop`
    yarn start
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:1391`!

    _Note: You'll also see a second link: _`http://localhost:1391/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql)._

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
      ├── cms
      ├── common
      ├── components
      ├── custom_types
      ├── images
      ├── pages
      ├── redux
      ├── styles
      ├── templates
      ├── utils
      ├── views
      ├── html.js
    ├── static
      ├── cms
        ├── config.yml
      ├── fonts
      ├── img
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── netlify.toml
    ├── package.json
    └── README.md

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

1.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

1.  **`/src/cms`**: This directory contains files needed for Netlify CMS.

1.  **`/src/common`**: This directory has exported Typescript Types.

1.  **`/src/compoments`**: This directory contains all of the more atomic components to be used in Pages and Views. You can import named components from the `@components` directory utilizing the index.tsx file which exports everything in this directory.

1.  **`/src/custom_types`**: Custom types for npm packages that don't have Typescript support.

1.  **`/src/images`**: Images directory for files that get imported via JS imports in `src` files.

1.  **`/src/pages`**: A Gatsby convention, any file in here generates a Statically Generated Page with a matching route. For `*.md` files, these create routes that get rendered by files in the `src/templates` directory in conjunction with NetlifyCMS using the `templateKey`.

1.  **`/src/redux`**: Global state management using Redux "Ducks" pattern and some middlewares.

1.  **`/src/styles`**: Directory of global variables files, a reset file, and related to be imported elsewhere.

1.  **`/src/templates`**: Files that are used for rendering the markdown files in the `src/pages` directory for NetlifyCMS-driven content.

1.  **`/src/utils`**: Miscellaneous javascript functions and React hooks.

1.  **`/src/views`**: Non-static routes that Gatsby doesn't handle during buildtime. This is a hybrid app, so all views are the client-side routes that get pulled into the Router in `src/pages/app.tsx`.

1.  **`/src/html.js`**: Gatsby-specific override to inject things into `<head>`

1.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

1.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).

1.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

1.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

1.  **`netlify.toml`**: Netlify config file for using different contexts and setting environment variables based on context.

1.  **`static/cms/config.yml`**: A yaml file for defining schemas to use in NetlifyCMS

## 💫 Deploy

This project is automatically deployed to Netlify via commits. Any commits to `master` branch deploy the production getpackup.com website, and `test` updates test.getpackup.com. Other branches and PR's currently do not get a Netlify deploy but that is an option should it be needed later.
