import React, { FunctionComponent, CSSProperties } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import { brandPrimary, brandPrimaryHover, white, lightestGray, textColor } from '@styles/color';
import {
  threeQuarterSpacer,
  doubleSpacer,
  quarterSpacer,
  halfSpacer,
  breakpoints,
  baseSpacer,
} from '@styles/size';
import { fontSizeSmall } from '@styles/typography';

type PillProps = {
  to?: string;
  text: string;
  color?: 'neutral' | 'primary';
  style?: CSSProperties;
};

const renderColor = (color: PillProps['color']) => {
  switch (color) {
    case 'neutral':
      return {
        backgroundColor: lightestGray,
        hoverBackgroundColor: lightestGray,
        color: textColor,
      };
    case 'primary':
      return {
        backgroundColor: brandPrimary,
        hoverBackgroundColor: brandPrimaryHover,
        color: white,
      };
    default:
      return {
        backgroundColor: brandPrimary,
        hoverBackgroundColor: brandPrimaryHover,
        color: white,
      };
  }
};

/* https://dev.to/joostkiens/creating-practical-instagram-like-galleries-and-horizontal-lists-with-css-scroll-snapping-580e */
export const PillWrapper = styled.div`
  display: flex;
  margin: ${halfSpacer} -${halfSpacer};
  padding: 0 ${halfSpacer};
  overflow-x: scroll;
  overscroll-behavior: contain;
  scrollbar-width: none;
  touch-action: pan-x;
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

const StyledPill = styled.span`
  display: inline-block;
  padding: ${quarterSpacer} ${threeQuarterSpacer};
  background-color: ${(props: { color: PillProps['color'] }) =>
    props.color && renderColor(props.color).backgroundColor};
  border-radius: ${doubleSpacer};
  margin: ${quarterSpacer};
  transition: all 0.2s ease-in-out;
  color: ${(props) => props.color && renderColor(props.color).color};

  &:hover {
    background-color: ${(props) => props.color && renderColor(props.color).hoverBackgroundColor};
  }
`;

const StyledLink = styled(Link)`
  display: block;
  color: ${white};
  font-size: ${fontSizeSmall};
  transition: all 0.2s ease-in-out;

  &:hover,
  &:focus {
    color: ${white};
  }
`;

const Pill: FunctionComponent<PillProps> = (props) => {
  return (
    <StyledPill color={props.color} style={props.style}>
      <small>{props.to ? <StyledLink to={props.to}>{props.text}</StyledLink> : props.text}</small>
    </StyledPill>
  );
};

export default Pill;
