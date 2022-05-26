import { baseBorderStyle } from '@styles/mixins';
import { baseSpacer } from '@styles/size';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

type HorizontalScrollerProps = { withBorder?: boolean };

/* https://dev.to/joostkiens/creating-practical-instagram-like-galleries-and-horizontal-lists-with-css-scroll-snapping-580e */
const HorizontalScrollerWrapper = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  overflow-x: scroll;
  scrollbar-width: none;
  /* overscroll-behavior: contain; */
  /* touch-action: pan-x; */
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  cursor: ew-resize;
  border: ${(props: HorizontalScrollerProps) => (props.withBorder ? baseBorderStyle : 'none')};

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

const HorizontalScroller: FunctionComponent<HorizontalScrollerProps> = ({
  withBorder,
  children,
}) => {
  return <HorizontalScrollerWrapper withBorder={withBorder}>{children}</HorizontalScrollerWrapper>;
};

export default HorizontalScroller;
