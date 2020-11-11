import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';

export type ContentType = {
  content: any;
};

export const HTMLContent = ({ content }: ContentType) => (
  // eslint-disable-next-line react/no-danger
  <div dangerouslySetInnerHTML={{ __html: content }} />
);

export const MarkdownContent = ({ content }: ContentType) => <ReactMarkdown source={content} />;

const Content = ({ content }: ContentType) => <div>{content}</div>;

export default Content;
