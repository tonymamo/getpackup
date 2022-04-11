import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { baseSpacer, doubleSpacer } from '@styles/size';
import { offWhite } from '@styles/color';
import { baseBorderStyle } from '@styles/mixins';

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

  background: linear-gradient(90deg, ${offWhite} 33%, rgba(255, 255, 255, 0)),
    linear-gradient(90deg, rgba(255, 255, 255, 0), ${offWhite} 66%) 0 100%,
    radial-gradient(farthest-side at 0 50%, rgba(0, 0, 0, 0.25), transparent),
    radial-gradient(farthest-side at 100% 50%, rgba(0, 0, 0, 0.25), transparent) 0 100%;
  background-repeat: no-repeat;
  background-size: ${doubleSpacer} 100%, ${doubleSpacer} 100%, ${baseSpacer} 100%,
    ${baseSpacer} 100%;
  background-position: 0 0, 100%, 0 0, 100%;
  background-attachment: local, local, scroll, scroll;
  background-color: transparent;
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
