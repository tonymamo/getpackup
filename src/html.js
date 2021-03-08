import React from 'react';

export default function HTML(props) {
  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {props.headComponents}
        <link
          rel="stylesheet"
          type="text/css"
          media="all"
          href="https://cloud.typography.com/7222118/6340832/css/fonts.css"
        />
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        {/* eslint-disable-next-line react/no-danger */}
        <div key="body" id="___gatsby" dangerouslySetInnerHTML={{ __html: props.body }} />
        {props.postBodyComponents}
      </body>
    </html>
  );
}
