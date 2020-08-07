import React from 'react';

export type ContentType = {
  content: any;
};

export const HTMLContent = ({ content }: ContentType) => (
  // eslint-disable-next-line react/no-danger
  <div dangerouslySetInnerHTML={{ __html: content }} />
);

const Content = ({ content }: ContentType) => <div>{content}</div>;

export default Content;
