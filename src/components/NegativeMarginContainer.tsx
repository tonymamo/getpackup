import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { baseSpacer, doubleSpacer } from '@styles/size';

type NegativeMarginContainerProps = {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  height?: string;
};

const NegativeMarginContainer: FunctionComponent<NegativeMarginContainerProps> = styled.div`
  margin-top: ${(props: NegativeMarginContainerProps) => (props.top ? `-${baseSpacer}` : 0)};
  margin-right: ${(props: NegativeMarginContainerProps) =>
    props.right ? `-${baseSpacer}` : baseSpacer};
  margin-bottom: ${(props: NegativeMarginContainerProps) =>
    props.bottom ? `-${baseSpacer}` : baseSpacer};
  margin-left: ${(props: NegativeMarginContainerProps) => (props.left ? `-${baseSpacer}` : 0)};
  width: ${(props: NegativeMarginContainerProps) =>
    props.left && props.right ? `calc(100% + ${doubleSpacer})` : `calc(100% + ${baseSpacer})`};
  height: ${(props: NegativeMarginContainerProps) => (props.height ? props.height : 'auto')};
  overflow: hidden;
`;

export default NegativeMarginContainer;
