import { FunctionComponent } from 'react';
import styled from 'styled-components';

type FlexContainerProps = {
  flexDirection?: 'row' | 'column';
  justifyContent?:
    | 'space-between'
    | 'space-around'
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'left'
    | 'right';
  alignItems?:
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'left'
    | 'right'
    | 'stretch';
  flexWrap?: 'wrap' | 'nowrap';
  height?: string;
  style?: {};
  as?: string;
};

const FlexContainer: FunctionComponent<FlexContainerProps> = styled.div<FlexContainerProps>`
  display: flex;
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  max-width: 100%;
  width: ${(props) => (props.flexWrap === 'nowrap' ? '100%' : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  flex-wrap: ${(props) => props.flexWrap};
  flex-direction: ${(props) => props.flexDirection};
`;

FlexContainer.defaultProps = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export default FlexContainer;
