import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { baseSpacerUnit } from '../styles/size';

const Row: FunctionComponent<{}> = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -${baseSpacerUnit / 2}px;
  margin-left: -${baseSpacerUnit / 2}px;
`;

export default Row;
