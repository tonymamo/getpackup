import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { halfSpacer, baseSpacer, breakpoints } from '@styles/size';

type HorizontalScrollerProps = {};

/* https://dev.to/joostkiens/creating-practical-instagram-like-galleries-and-horizontal-lists-with-css-scroll-snapping-580e */
export const HorizontalScrollerWrapper = styled.div`
  display: flex;
  margin: ${halfSpacer} -${halfSpacer};
  padding: 0 ${halfSpacer};
  overflow-x: scroll;
  scrollbar-width: none;
  /* overscroll-behavior: contain; */
  /* touch-action: pan-x; */
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;

  @media only screen and (min-width: ${breakpoints.sm}) {
    /* match values from PageContainer which increase on viewports above breakpoint.sm */
    margin: ${halfSpacer} -${baseSpacer};
    padding: 0 ${baseSpacer};
  }

  &::-webkit-scrollbar {
    display: none;
  }

  & span {
    flex-shrink: 0;

    /* hacky fix for padding at the end of the list */
    & :last-child {
      position: relative;
    }

    &:last-child::after {
      position: absolute;
      left: 100%;
      height: 1px;
      width: ${baseSpacer};
      display: block;
      content: '';
    }
  }
`;

const HorizontalScroller: FunctionComponent<HorizontalScrollerProps> = ({ children }) => {
  return <HorizontalScrollerWrapper>{children}</HorizontalScrollerWrapper>;
};

export default HorizontalScroller;
