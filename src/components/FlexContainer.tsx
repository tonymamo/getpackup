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
};

const FlexContainer: FunctionComponent<FlexContainerProps> = styled.div`
  display: flex;
  align-items: ${(props: FlexContainerProps) => props.alignItems};
  justify-content: ${(props: FlexContainerProps) => props.justifyContent};
  max-width: 100%;
  height: ${(props: FlexContainerProps) => (props.height ? props.height : 'auto')};
  flex-wrap: ${(props: FlexContainerProps) => props.flexWrap};
  flex-direction: ${(props: FlexContainerProps) => props.flexDirection};
`;

FlexContainer.defaultProps = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export default FlexContainer;
