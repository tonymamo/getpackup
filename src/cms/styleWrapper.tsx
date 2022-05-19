/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { StyleSheetManager } from 'styled-components';

const StyleInjector = ({ children }: { children: any }) => {
  const [iframeRef, setIframeRef] = useState<HTMLHeadElement | null>(null);

  useEffect(() => {
    const iframe = document.getElementsByTagName('iframe')[0];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const iframeHeadElem = iframe.contentDocument!.head!;
    setIframeRef(iframeHeadElem);
  }, []);

  return iframeRef && <StyleSheetManager target={iframeRef}>{children}</StyleSheetManager>;
};

const withStyledComponentsRendered = (Comp: any) => {
  return (props: any) => (
    <StyleInjector>
      <Comp {...props} />
    </StyleInjector>
  );
};

export default withStyledComponentsRendered;
