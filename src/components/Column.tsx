import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { baseSpacer, baseSpacerUnit, breakpoints } from '@styles/size';

function createColumnSpan(breakpoint: number) {
  const width = (breakpoint / 12) * 100;
  return `
    width: ${width}%;
    margin-left: 0;
  `;
}

function createColumnOffset(breakpoint: number) {
  const width = (breakpoint / 12) * 100;
  return `margin-left: ${width}%;`;
}

function setOrder(order: number) {
  return `order: ${order}`;
}

type allowedNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type ColumnProps = {
  xs?: allowedNumbers;
  sm?: allowedNumbers;
  md?: allowedNumbers;
  lg?: allowedNumbers;
  xl?: allowedNumbers;
  xsOffset?: allowedNumbers;
  smOffset?: allowedNumbers;
  mdOffset?: allowedNumbers;
  lgOffset?: allowedNumbers;
  xlOffset?: allowedNumbers;
  xsOrder?: allowedNumbers;
  smOrder?: allowedNumbers;
  mdOrder?: allowedNumbers;
  lgOrder?: allowedNumbers;
  xlOrder?: allowedNumbers;
  // Adds a bottom margin when stacking in responsive layout
  xsSpacer?: boolean;
  smSpacer?: boolean;
  mdSpacer?: boolean;
  lgSpacer?: boolean;
  xlSpacer?: boolean;
};

const bottomSpacer = `
  margin-bottom: ${baseSpacer};
`;

const noSpacer = `
  margin-bottom: 0;
`;

const Column: FunctionComponent<ColumnProps> = styled.div`
  position: relative;
  min-height: 1px;
  padding-right: ${baseSpacerUnit / 2}px;
  padding-left: ${baseSpacerUnit / 2}px;
  flex: 0 0 auto;

  ${(props: ColumnProps) => (props.xs ? createColumnSpan(props.xs) : 'width: 100%')};
  ${(props: ColumnProps) => props.xsOffset && createColumnOffset(props.xsOffset)};
  ${(props: ColumnProps) => props.xsOrder && setOrder(props.xsOrder)};
  ${(props: ColumnProps) => (props.xsSpacer ? bottomSpacer : noSpacer)};

  @media only screen and (min-width: ${breakpoints.sm}) {
    ${(props: ColumnProps) => props.sm && createColumnSpan(props.sm)};
    ${(props: ColumnProps) => props.smOffset && createColumnOffset(props.smOffset)};
    ${(props: ColumnProps) => props.smOrder && setOrder(props.smOrder)};
    ${(props: ColumnProps) => (props.smSpacer ? bottomSpacer : noSpacer)};
  }

  @media only screen and (min-width: ${breakpoints.md}) {
    ${(props: ColumnProps) => props.md && createColumnSpan(props.md)};
    ${(props: ColumnProps) => props.mdOffset && createColumnOffset(props.mdOffset)};
    ${(props: ColumnProps) => props.mdOrder && setOrder(props.mdOrder)};
    ${(props: ColumnProps) => (props.mdSpacer ? bottomSpacer : noSpacer)};
  }

  @media only screen and (min-width: ${breakpoints.lg}) {
    ${(props: ColumnProps) => props.lg && createColumnSpan(props.lg)};
    ${(props: ColumnProps) => props.lgOffset && createColumnOffset(props.lgOffset)};
    ${(props: ColumnProps) => props.lgOrder && setOrder(props.lgOrder)};
    ${(props: ColumnProps) => (props.lgSpacer ? bottomSpacer : noSpacer)};
  }

  @media only screen and (min-width: ${breakpoints.xl}) {
    ${(props: ColumnProps) => props.xl && createColumnSpan(props.xl)};
    ${(props: ColumnProps) => props.xlOffset && createColumnOffset(props.xlOffset)};
    ${(props: ColumnProps) => props.xlOrder && setOrder(props.xlOrder)};
    ${(props: ColumnProps) => (props.xlSpacer ? bottomSpacer : noSpacer)};
  }
`;

export default Column;
