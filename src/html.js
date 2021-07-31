/* eslint-disable react/jsx-filename-extension */
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
        {/* https://csswizardry.com/2019/08/making-cloud-typography-faster/ */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cloud.typography.com/7222118/6340832/css/fonts.css"
          media="print"
          onLoad="this.media='all'"
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
