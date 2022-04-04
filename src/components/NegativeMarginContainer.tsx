import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { baseSpacer } from '@styles/size';

type NegativeMarginContainerProps = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  height?: string;
  aspectRatio?: number;
};

const NegativeMarginContainer: FunctionComponent<NegativeMarginContainerProps> = styled.div`
  margin-top: ${(props: NegativeMarginContainerProps) => (props.top ? `-${props.top}` : 0)};
  margin-right: ${(props: NegativeMarginContainerProps) =>
    props.right ? `-${props.right}` : baseSpacer};
  margin-bottom: ${(props: NegativeMarginContainerProps) =>
    props.bottom ? `-${props.bottom}` : baseSpacer};
  margin-left: ${(props: NegativeMarginContainerProps) => (props.left ? `-${props.left}` : 0)};
  width: ${(props: NegativeMarginContainerProps) =>
    props.left && props.right
      ? `calc(100% + ${props.left} + ${props.right})`
      : `calc(100% + ${baseSpacer})`};
  height: ${(props: NegativeMarginContainerProps) => (props.height ? props.height : 'auto')};
  overflow: hidden;
  aspect-ratio: ${(props) => props.aspectRatio || 'initial'};
`;

export default NegativeMarginContainer;
