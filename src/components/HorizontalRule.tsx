import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { halfSpacer, doubleSpacer } from '../styles/size';
import { baseBorderStyle } from '../styles/mixins';

type HRProps = {
  compact?: boolean;
};

const StyledHorizontalRule = styled.hr`
  border: 0;
  border-top: ${baseBorderStyle};
  width: 100%;
  margin: ${(props: HRProps) => (props.compact ? halfSpacer : doubleSpacer)} 0;
`;

const HorizontalRule: FunctionComponent<HRProps> = ({ compact }) => (
  <StyledHorizontalRule compact={compact} />
);

HorizontalRule.displayName = 'HorizontalRule';
HorizontalRule.defaultProps = {
  compact: false,
};

export default HorizontalRule;
